import { fetchNewJobIds } from './fetch-new-jobs';
import dotenv from 'dotenv';

async function main() {
    dotenv.config();
    // On start, and on an interval thereafter, update the job list
    await fetchNewJobIds();
    setInterval(
        fetchNewJobIds,
        1000 * 60 * Number(process.env.FETCH_INTERVAL_MINUTES)
    );
}

main().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
