import { createHash } from 'crypto';
import sql from './database/db';
import cheerio from 'cheerio';
import { scrapeJob } from './scraper-util';

export class Job {
    // Summary (from RSS feed)
    id!: number; // Unique job ID
    link!: string; // URL to job posting
    title!: string; // Job title
    publishDate!: Date; // Publication date
    deadline!: Date; // Application deadline
    grade!: string; // Job grade
    county!: string; // Job location
    summaryHash!: string;

    // Full (from job page)
    fullHash?: string;

    /**
     * Create a Job from RSS feed entry
     */
    static fromRSS(entry: {
        id: number;
        link: string;
        title: string;
        publishDate: Date;
        deadline: Date;
        grade: string;
        county: string;
    }): Job {
        const job = new Job();
        Object.assign(job, entry);
        // Stringify the RSS-derived fields deterministically and compute a SHA-256 hash
        // We stringify the entry object which contains the RSS fields used to create the job.
        job.summaryHash = createHash('sha256')
            .update(JSON.stringify(entry))
            .digest('hex');
        return job;
    }

    /**
     * Fetch and populate full details from the job page
     */
    async populateFromJobPage(): Promise<void> {
        if (!this.link) throw new Error('Job link is missing');
        const scrapeResult = await scrapeJob(this.link);
        this.fullHash = createHash('sha256')
            .update(JSON.stringify(scrapeResult))
            .digest('hex');
    }

    /**
     * Fetch and populate from the database
     */
    static async fromDatabase(id: string): Promise<Job> {
        const job = new Job();
        const rows = await sql`SELECT * FROM jobs WHERE id = ${id}`;
        if (rows.length === 0)
            throw new Error(`Job with id ${id} not found in database`);
        const row = rows[0];
        Object.assign(job, row);
        return job;
    }

    /**
     * Replace the database entry with this job's data
     */
    async saveToDatabase(): Promise<void> {
        await sql`DELETE FROM jobs WHERE id = ${this.id}`;
        await sql`
                INSERT INTO jobs (id, link, title, publishDate, deadlineDate, grade, county, summaryHash)
                VALUES (
                    ${this.id},
                    ${this.link},
                    ${this.title},
                    ${this.publishDate},
                    ${this.deadline},
                    ${this.grade},
                    ${this.county},
                    ${this.summaryHash ?? ''}
                )
            `;
    }

    toDisplayObject(): object {
        return {
            id: this.id,
            title: this.title,
            county: this.county,
            link: this.link,
            published: this.publishDate.toDateString(),
            deadline: this.deadline.toDateString(),
            grade: this.grade
        };
    }
}
