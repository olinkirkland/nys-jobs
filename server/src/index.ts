import dotenv from 'dotenv';
import { createTable } from './database/db-helpers';
import {
    createFromDatabaseObject,
    saveToDatabase,
    updateAIParsedDetails,
    updateHumanReadableDetails,
    updateJobDetailsFromWebsites,
    updateJobSummariesFromRSS
} from './job-helpers';
import { createServer } from './server';
import sql from './database/db';
import { extractJobData } from './ai/ai-parser';

async function main() {
    // Ensure the jobs table exists
    await createTable();

    // Create the server
    dotenv.config();
    const app = createServer();

    setInterval(
        async () => {
            await updateJobSummariesFromRSS();
            await updateJobDetailsFromWebsites();
            await updateHumanReadableDetails();
            await updateAIParsedDetails();
        },
        1000 * 60 * Number(process.env.FETCH_INTERVAL_MINUTES)
    );

    // On start, and on an interval thereafter, update the job list
    await updateJobSummariesFromRSS();
    await updateJobDetailsFromWebsites();
    await updateHumanReadableDetails();
    await updateAIParsedDetails();
}

main().catch((err) => {
    console.error('Failed during main loop:', err);
    process.exit(1);
});
