import axios from 'axios';
import * as cheerio from 'cheerio';

export async function fetchNewJobIds() {
    // Get the new jobs from the NYS Jobs RSS feed url
    const url = 'https://statejobs.ny.gov/rss/employeerss.cfm';
    const response = await axios.get(url);

    // Parse the response as an XML document
    const $ = cheerio.load(response.data as string, { xmlMode: true });
    const items = $('item');
    console.log(`Found ${items.length} items in the RSS feed.`);
    console.log('Parsing items...');

    const jobs: Job[] = items
        .map((i, el) => {
            // title is the job title
            const title = $(el).find('title').text();
            // link is a full URL
            const link = $(el).find('link').text();
            // pubDate is in RFC-822 format
            const pubDate = new Date($(el).find('pubDate').text());
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
                pubDate,
                deadline: deadlineMatch
                    ? new Date(deadlineMatch[1])
                    : new Date(0),
                grade: gradeMatch ? gradeMatch[1] : 'Unknown',
                county: countyMatch ? countyMatch[1].trim() : ''
            });
        })
        .get();

    console.log(`Parsed ${jobs.length} jobs.`);
    // Log the last 5 jobs for verification
    jobs.slice(-5).forEach((job) => {
        console.log(job.toString());
    });
}

export class Job {
    // From RSS feed (required)
    id!: number; // Unique job ID
    link!: string; // URL to job posting
    title!: string; // Job title
    pubDate!: Date; // Publication date
    deadline!: Date; // Application deadline
    grade!: string; // Job grade
    county!: string; // Job location

    // Hashes
    rssString?: string;
    rssHash?: string;
    fullString?: string;
    fullHash?: string;

    /**
     * Populate from RSS feed entry
     */
    static fromRSS(entry: {
        id: number;
        link: string;
        title: string;
        pubDate: Date;
        deadline: Date;
        grade: string;
        county: string;
    }): Job {
        const job = new Job();
        Object.assign(job, entry);
        return job;
    }

    /**
     * Fetch and populate full details from the job page
     */
    async populateFromURL(): Promise<void> {
        if (!this.link) throw new Error('Job link is missing');

        const response = await axios.get(this.link);
        if (typeof response.data !== 'string')
            throw new Error('Unexpected response data type');
        const $ = cheerio.load(response.data);

        // TODO: scraping logic
    }

    toString(): string {
        return `${this.id}\n ${this.title} in ${this.county}\n ${this.link}\n Published: ${this.pubDate.toDateString()} , deadline: ${this.deadline.toDateString()}\n Grade: ${this.grade}`;
    }
}
