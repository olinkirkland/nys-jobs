import dotenv from 'dotenv';
import { createTable } from './database/db-helpers';
import { updateHumanReadableDetails, updateJobDetailsFromWebsites, updateJobSummariesFromRSS } from './job-helpers';
import { createServer } from './server';
import sql from './database/db';

async function main() {
    // WARNING: DON'T DROP THE TABLE UNLESS YOU'RE TOTALLY SURE YOU WANT TO DO THAT
    // For development purposes, drop the table to start fresh
    if (false) await sql`DROP TABLE IF EXISTS jobs;`;

    await createTable();

    dotenv.config();
    // On start, and on an interval thereafter, update the job list
    await updateJobSummariesFromRSS();
    await updateJobDetailsFromWebsites();
    await updateHumanReadableDetails();

    // Get a list of unique job.agency
    // const rows = await sql`SELECT DISTINCT agency FROM jobs;`;
    // console.log(rows);

    setInterval(
        async () => {
            await updateJobSummariesFromRSS();
            await updateJobDetailsFromWebsites();
            await updateHumanReadableDetails();
        },
        1000 * 60 * Number(process.env.FETCH_INTERVAL_MINUTES)
    );

    // TEMP: Get a job object for the first job in the database
    // const rows = await sql`SELECT * FROM jobs LIMIT 1`;
    // const row = rows[0];
    // const job = createFromDatabaseObject(row);
    // if (!job.link) throw new Error(`Can't fetch job data; no URL found (#${job.id})`);
    // const jobData = await fetchJobDataFromURL(job.link);
    // Object.assign(job, jobData);
    // saveToDatabase(job);

    // Create the server
    const app = createServer();
}

main().catch((err) => {
    console.error('Failed during main loop:', err);
    process.exit(1);
});
