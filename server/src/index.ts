import sql from '@/database/db';
import { updateJobSummaries, updateNewJobDetails } from './fetch-new-jobs';
import dotenv from 'dotenv';
import { createServer } from './server';
import { Job } from './job';

async function main() {
    // For development purposes, drop the table to start fresh
    // await sql`DROP TABLE IF EXISTS jobs;`;

    // Create the table if it doesn't exist
    await sql`
        CREATE TABLE IF NOT EXISTS jobs (
            -- Summary
            id SERIAL PRIMARY KEY,
            link TEXT NOT NULL,
            title TEXT NOT NULL,
            publishDate TIMESTAMP NOT NULL,
            deadlineDate TIMESTAMP NOT NULL,
            grade TEXT NOT NULL,
            county TEXT NOT NULL,
            summaryHash TEXT,
            fullHash TEXT,

            -- Basics
            nyHelp TEXT,
            agency TEXT,
            occupationalCategory TEXT,
            salaryGrade TEXT,
            bargainingUnit TEXT,
            salaryRange TEXT,
            employmentType TEXT,
            appointmentType TEXT,
            jurisdictionalClass TEXT,
            travelPercentage TEXT,

            -- Schedule
            workweek TEXT,
            hoursPerWeek TEXT,
            workdayFrom TEXT,
            workdayTo TEXT,
            flextimeAllowed TEXT,
            mandatoryOvertime TEXT,
            compressedWorkweek TEXT,
            telecommutingAllowed TEXT,

            -- Location
            streetAddress TEXT,
            city TEXT,
            state TEXT,
            zipCode TEXT,

            -- Job Specifics
            dutiesDescription TEXT,
            minimumQualifications TEXT,
            additionalComments TEXT,

            -- Contact
            contactName TEXT,
            contactPhone TEXT,
            contactFax TEXT,
            contactEmail TEXT,
            contactStreet TEXT,
            contactCity TEXT,
            contactState TEXT,
            contactZip TEXT,
            notesOnApplying TEXT
        );
    `;

    dotenv.config();
    // On start, and on an interval thereafter, update the job list
    await updateJobSummaries();
    // await updateNewJobDetails();

    setInterval(
        async () => {
            await updateJobSummaries();
            // await updateNewJobDetails();
        },
        1000 * 60 * Number(process.env.FETCH_INTERVAL_MINUTES)
    );

    // Get a job object for the first job in the database
    const jobId = await sql`SELECT id FROM jobs LIMIT 1`;
    const job = await Job.fromDatabase(jobId[0].id);
    console.log(job);
    await job.populateFromJobPage();

    // Create the server
    const app = createServer();
}

main().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
