import axios from 'axios';
import * as cheerio from 'cheerio';
import { createHash } from 'crypto';
import ProgressBar from 'progress';
import sql from './database/db';
import { Job } from './job';
import { createJob, deleteJob } from './database/db-helpers';
import { fetchJobDataFromURL } from './web-scraper';

/**
 * Get the latest RSS feed, update the database based on the RSS feed
 * New and changed jobs get some of their data parsed directly from the RSS feed
 */
export async function updateJobSummariesFromRSS() {
    // Get the new jobs from the NYS Jobs RSS feed url
    const url = 'https://statejobs.ny.gov/rss/employeerss.cfm';
    const response = await axios.get(url);

    // Parse the response as an XML document
    const $ = cheerio.load(response.data as string, { xmlMode: true });
    const items = $('item');
    console.log(`Parsing ${items.length} job summaries from RSS feed...`);

    const rssJobSummaries: Job[] = items
        .map((i, el) => {
            // title is the job title
            const title = $(el).find('title').text().trim();
            // link is a full URL
            const link = $(el).find('link').text().trim();
            // publishDate is in RFC-822 format
            const publishDate = new Date($(el).find('pubDate').text());
            // The description field contains multiple pieces of information
            const description = $(el).find('description').text();
            // Extract fields from description using regex
            const idMatch = description.match(/ID:\s*(\d+)/);
            // Deadline is in MM/DD/YYYY format
            const deadlineMatch = description.match(/Deadline:\s*([\d/]+)/);
            // Grade can be either a number or a letter (e.g., "12" or "M")
            const gradeMatch = description.match(/Grade:\s*(\w+)/);
            // County is a string, may contain spaces or other characters
            const countyMatch = description.match(/County:\s*([\w\s]+)/);

            return createFromRSSObject({
                id: idMatch ? parseInt(idMatch[1], 10) : NaN,
                link,
                title,
                publishDate,
                deadline: deadlineMatch ? new Date(deadlineMatch[1]) : new Date(0),
                grade: gradeMatch ? gradeMatch[1] : 'Unknown',
                county: countyMatch ? countyMatch[1].trim() : ''
            });
        })
        .get();

    console.log('Parsing complete!');
    console.log(`Filtering to jobs with deadlines that haven't passed...`);

    const now = new Date();
    const rssJobSummariesFiltered = rssJobSummaries.filter((job) => {
        // Filter out jobs that passed the deadline
        return job.deadline >= now;
    });
    console.log(`Filtering complete! (${rssJobSummariesFiltered.length} jobs)`);

    console.log('Updating database with new or changed jobs...');
    const total = rssJobSummariesFiltered.length;
    const bar = new ProgressBar(`[:bar] :current/${total} :percent`, {
        total: rssJobSummariesFiltered.length,
        width: 36
    });

    const existingJobs = await sql`SELECT id, summaryHash FROM jobs`;
    const existingJobsMap = new Map(existingJobs.map((j) => [j.id, j.summaryhash]));
    for (const rssJobSummary of rssJobSummariesFiltered) {
        bar.tick();

        // Check the database to see if the id already exists
        if (!existingJobsMap.has(rssJobSummary.id)) {
            await saveToDatabase(rssJobSummary);
        } else {
            // Compare the summaryHash to see if it has changed
            const localSummaryHash = rssJobSummary.summaryHash;
            const remoteSummaryHash = existingJobsMap.get(rssJobSummary.id);
            // Compare the hashes
            if (remoteSummaryHash !== localSummaryHash) {
                // console.log(`\nSummary for job #${rssJobSummary.id} changed.`);
                // console.log(`  Hash (-): ${remoteSummaryHash}`);
                // console.log(`  Hash (+): ${localSummaryHash}`);
                await saveToDatabase(rssJobSummary);
            }
        }
    }

    console.log('Database update complete!');
}

/**
 * Fetch the websites for jobs that don't have a lastScraped value
 */
export async function updateJobDetailsFromWebsites() {
    const rows = await sql`SELECT * FROM jobs WHERE lastScraped IS NULL`;
    console.log(`Updating ${rows.length} job details from websites...`);
    for (const row of rows) {
        console.log(`↪ Scraping ${row.id}`);
        const job = createFromDatabaseObject(row);
        if (!job.link) throw new Error(`Can't fetch job data; no URL found (#${job.id})`);
        const jobData = await fetchJobDataFromURL(job.link);
        Object.assign(job, jobData);
        await saveToDatabase(job);
    }
    console.log('Job details updated!');
}

/**
 * Create a Job pulled from the NYS RSS feed
 */
export function createFromRSSObject(entry: {
    id: number;
    link: string;
    title: string;
    publishDate: Date;
    deadline: Date;
    grade: string;
    county: string;
}): Partial<Job> {
    const job: Partial<Job> = {};
    Object.assign(job, entry);

    // Stringify the RSS-derived fields deterministically and compute a SHA-256 hash
    // We stringify the entry object which contains the RSS fields used to create the job.
    job.summaryHash = createHash('sha256').update(JSON.stringify(entry)).digest('hex');
    return job;
}

/**
 * Create a Job from an object that was loaded from the SQL database
 */
export function createFromDatabaseObject(dbJob: any): Partial<Job> {
    const job: Partial<Job> = {};

    // Basic info
    job.id = dbJob.id;
    job.link = dbJob.link;
    job.title = dbJob.title;
    job.publishDate = dbJob.publishdate ? new Date(dbJob.publishdate) : undefined;
    job.deadline = dbJob.deadlinedate ? new Date(dbJob.deadlinedate) : undefined;
    job.grade = dbJob.grade;
    job.county = dbJob.county;
    job.summaryHash = dbJob.summaryhash;

    // Job details
    job.nyHelp = dbJob.nyhelp;
    job.agency = dbJob.agency;
    job.occupationalCategory = dbJob.occupationalcategory;
    job.salaryGrade = dbJob.salarygrade;
    job.bargainingUnit = dbJob.bargainingunit;
    job.salaryRange = dbJob.salaryrange;
    job.employmentType = dbJob.employmenttype;
    job.appointmentType = dbJob.appointmenttype;
    job.jurisdictionalClass = dbJob.jurisdictionalclass;
    job.travelPercentage = dbJob.travelpercentage;

    // Schedule
    job.workweek = dbJob.workweek;
    job.hoursPerWeek = dbJob.hoursperweek;
    job.workdayFrom = dbJob.workdayfrom;
    job.workdayTo = dbJob.workdayto;
    job.flextimeAllowed = dbJob.flextimeallowed;
    job.mandatoryOvertime = dbJob.mandatoryovertime;
    job.compressedWorkweek = dbJob.compressedworkweek;
    job.telecommutingAllowed = dbJob.telecommutingallowed;

    // Location
    job.streetAddress = dbJob.streetaddress;
    job.city = dbJob.city;
    job.state = dbJob.state;
    job.zipCode = dbJob.zipcode;

    // Job specifics
    job.dutiesDescription = dbJob.dutiesdescription;
    job.minimumQualifications = dbJob.minimumqualifications;
    job.additionalComments = dbJob.additionalcomments;

    // Contact
    job.contactName = dbJob.contactname;
    job.contactPhone = dbJob.contactphone;
    job.contactFax = dbJob.contactfax;
    job.contactEmail = dbJob.contactemail;
    job.contactStreet = dbJob.contactstreet;
    job.contactCity = dbJob.contactcity;
    job.contactState = dbJob.contactstate;
    job.contactZip = dbJob.contactzip;
    job.notesOnApplying = dbJob.notesonapplying;

    return job;
}

/**
 * Replace the database entry with this job's data
 */
export async function saveToDatabase(job: Partial<Job>): Promise<void> {
    if (!job.id) throw new Error(`Can't save to database; No job id`);

    await deleteJob(job.id);
    await createJob(job);
}