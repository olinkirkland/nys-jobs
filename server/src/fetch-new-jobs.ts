import axios from 'axios';
import * as cheerio from 'cheerio';
import ProgressBar from 'progress';
import sql from './database/db';
import { Job } from './job';

export async function updateJobSummaries() {
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

            return Job.fromRSS({
                id: idMatch ? parseInt(idMatch[1], 10) : NaN,
                link,
                title,
                publishDate,
                deadline: deadlineMatch
                    ? new Date(deadlineMatch[1])
                    : new Date(0),
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
    const jobsMap = new Map(existingJobs.map((j) => [j.id, j.summaryhash]));
    for (const rssJobSummary of rssJobSummariesFiltered) {
        bar.tick();

        // Check the database to see if the id already exists
        if (!jobsMap.has(rssJobSummary.id)) {
            await rssJobSummary.saveToDatabase();
        } else {
            // Compare the summaryHash to see if it has changed
            const localSummaryHash = rssJobSummary.summaryHash;
            const remoteSummaryHash = jobsMap.get(rssJobSummary.id);
            // Compare the hashes
            if (remoteSummaryHash !== localSummaryHash) {
                // console.log(`Summary for job #${rssJobSummary.id} changed.`);
                // console.log(`  Hash (-): ${remoteSummaryHash}`);
                // console.log(`  Hash (+): ${localSummaryHash}`);
                await rssJobSummary.saveToDatabase();
            }
        }
    }

    console.log('Database update complete!');
}

export async function updateNewJobDetails() {
    // Get all job ids from the database that do not have a fullHash
    const rows = await sql`SELECT * FROM jobs WHERE fullHash IS NULL`;
    console.log(`Found ${rows.length} jobs without full details.`);

    if (rows.length === 0) {
        console.log('No new job details to update.');
        return;
    }

    console.log('Updating job details from job pages...');

    const total = rows.length;
    let url = null;
    const bar = new ProgressBar(`[:bar] :current/${total} :percent :${url}`, {
        total: rows.length,
        width: 36
    });

    for (const row of rows) {
        const job = new Job();
        Object.assign(job, row);
        url = job.link;
        bar.tick();
        try {
            await job.populateFromJobPage();
            await job.saveToDatabase();
        } catch (err) {
            console.error(`Failed to populate job #${job.id}:`, err);
        }
    }

    console.log('Job details update complete!');
}
