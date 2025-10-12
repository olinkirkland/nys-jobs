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
    // Placeholder: Return most recent 20 jobs
    const dbJobs = await sql`SELECT * FROM jobs ORDER BY publishDate DESC LIMIT 20`;
    const jobs = dbJobs.map((dbJob) => {
        return createFromDatabaseObject(dbJob);
    });
    res.send(jobs);
});

export default router;
