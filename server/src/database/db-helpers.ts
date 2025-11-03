import { Job } from '@/job';
import sql from './db';

export async function createTable() {
    await sql`
        CREATE TABLE IF NOT EXISTS jobs (
            -- Summary
            id SERIAL PRIMARY KEY,
            link TEXT,
            title TEXT,
            publishDate TIMESTAMP,
            deadlineDate TIMESTAMP,
            grade TEXT,
            county TEXT,
            summaryHash TEXT,

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
            notesOnApplying TEXT,

            -- Misc
            lastScraped TIMESTAMP,

            -- Human Readable
            humanReadableAgency TEXT,
            humanReadableExtractedData JSON
        );
    `;
}

export async function deleteJob(id: number) {
    await sql`DELETE FROM jobs WHERE id = ${id}`;
}

export async function createJob(job: Partial<Job>): Promise<void> {
    await sql`
        INSERT INTO jobs (
            id, link, title, publishDate, deadlineDate, grade, county, summaryHash,
            nyHelp, agency, occupationalCategory, salaryGrade, bargainingUnit, salaryRange,
            employmentType, appointmentType, jurisdictionalClass, travelPercentage,
            workweek, hoursPerWeek, workdayFrom, workdayTo, flextimeAllowed, mandatoryOvertime,
            compressedWorkweek, telecommutingAllowed,
            streetAddress, city, state, zipCode,
            dutiesDescription, minimumQualifications, additionalComments,
            contactName, contactPhone, contactFax, contactEmail, contactStreet, contactCity, 
            contactState, contactZip, notesOnApplying, lastScraped, humanReadableAgency, humanReadableExtractedData
        )
        VALUES (
            ${toDbValue(job.id)},
            ${toDbValue(job.link)},
            ${toDbValue(job.title)},
            ${toDbValue(job.publishDate)},
            ${toDbValue(job.deadline)},
            ${toDbValue(job.grade)},
            ${toDbValue(job.county)},
            ${toDbValue(job.summaryHash)},
            ${toDbValue(job.nyHelp)},
            ${toDbValue(job.agency)},
            ${toDbValue(job.occupationalCategory)},
            ${toDbValue(job.salaryGrade)},
            ${toDbValue(job.bargainingUnit)},
            ${toDbValue(job.salaryRange)},
            ${toDbValue(job.employmentType)},
            ${toDbValue(job.appointmentType)},
            ${toDbValue(job.jurisdictionalClass)},
            ${toDbValue(job.travelPercentage)},
            ${toDbValue(job.workweek)},
            ${toDbValue(job.hoursPerWeek)},
            ${toDbValue(job.workdayFrom)},
            ${toDbValue(job.workdayTo)},
            ${toDbValue(job.flextimeAllowed)},
            ${toDbValue(job.mandatoryOvertime)},
            ${toDbValue(job.compressedWorkweek)},
            ${toDbValue(job.telecommutingAllowed)},
            ${toDbValue(job.streetAddress)},
            ${toDbValue(job.city)},
            ${toDbValue(job.state)},
            ${toDbValue(job.zipCode)},
            ${toDbValue(job.dutiesDescription)},
            ${toDbValue(job.minimumQualifications)},
            ${toDbValue(job.additionalComments)},
            ${toDbValue(job.contactName)},
            ${toDbValue(job.contactPhone)},
            ${toDbValue(job.contactFax)},
            ${toDbValue(job.contactEmail)},
            ${toDbValue(job.contactStreet)},
            ${toDbValue(job.contactCity)},
            ${toDbValue(job.contactState)},
            ${toDbValue(job.contactZip)},
            ${toDbValue(job.notesOnApplying)},
            ${toDbValue(job.lastScraped)},
            ${toDbValue(job.humanReadableAgency)},
            ${toDbValue(job.humanReadableExtractedData)}
        )
    `;
}

// Ensure undefined values are changed to null
export function toDbValue<T>(value: T | undefined): T | null {
    return value ?? null;
}
