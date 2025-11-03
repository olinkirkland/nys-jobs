import sql from '@/database/db';
import { createFromDatabaseObject } from '@/job-helpers';
import { Router } from 'express';

const router = Router();

/**
 * GET /api/jobs
 * Retrieve a list of jobs
 * Response: JSON array of job objects
 */

router.get('/', async (req, res) => {
    // Placeholder: Return most recent 20 jobs that have humanReadableExtractedData
    const dbJobs =
        await sql`SELECT * FROM jobs WHERE humanreadableextracteddata IS NOT NULL ORDER BY publishdate DESC LIMIT 20`;
    const jobs = dbJobs.map((dbJob) => {
        return createFromDatabaseObject(dbJob);
    });
    res.send(jobs);
});

export default router;
