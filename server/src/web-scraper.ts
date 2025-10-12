import axios from 'axios';
import * as cheerio from 'cheerio';
import { Job } from './job';

// Key mappings
type KeyDefinition = {
    s: string; // Section id the key is found in
    w: string; // The key used to parse the value from the webpage
    j: keyof Job; // The corresponding key in the job object
    f?: Function; // The function to execute to transform this data
    p?: any[]; // Optional parameters to pass to the function
};

const Section = {
    I: 'information',
    S: 'schedule',
    L: 'location',
    J: 'jobspecifics',
    C: 'contact'
};

const definitions: KeyDefinition[] = [
    // Basics
    { s: Section.I, j: 'nyHelp', w: 'NY HELP', f: parseYesNoToBoolean },
    { s: Section.I, j: 'agency', w: 'Agency' },
    { s: Section.I, j: 'occupationalCategory', w: 'Occupational Category' },
    { s: Section.I, j: 'salaryGrade', w: 'Salary Grade' },
    { s: Section.I, j: 'employmentType', w: 'Employment Type' },
    { s: Section.I, j: 'appointmentType', w: 'Appointment Type' },
    { s: Section.I, j: 'jurisdictionalClass', w: 'Jurisdictional Class' },
    { s: Section.I, j: 'travelPercentage', w: 'Travel Percentage', f: parsePercentToNumber },

    // Schedule
    { s: Section.S, j: 'workweek', w: 'Workweek' },
    { s: Section.S, j: 'hoursPerWeek', w: 'Hours Per Week' },
    { s: Section.S, j: 'workdayFrom', w: 'From' },
    { s: Section.S, j: 'workdayTo', w: 'To' },
    { s: Section.S, j: 'flextimeAllowed', w: 'Flextime allowed?', f: parseYesNoToBoolean },
    { s: Section.S, j: 'mandatoryOvertime', w: 'Mandatory overtime?', f: parseYesNoToBoolean },
    { s: Section.S, j: 'compressedWorkweek', w: 'Compressed workweek allowed?', f: parseYesNoToBoolean },
    { s: Section.S, j: 'telecommutingAllowed', w: 'Telecommuting allowed?', f: parseYesNoToBoolean },

    // Location
    { s: Section.L, j: 'county', w: 'County' },
    { s: Section.L, j: 'streetAddress', w: 'Street Address' },
    { s: Section.L, j: 'city', w: 'City' },
    { s: Section.L, j: 'state', w: 'State' },
    { s: Section.L, j: 'zipCode', w: 'Zip Code' },

    // Job Specifics
    { s: Section.J, j: 'dutiesDescription', w: 'Duties Description' },
    { s: Section.J, j: 'minimumQualifications', w: 'Minimum Qualifications' },
    { s: Section.J, j: 'additionalComments', w: 'Additional Comments' },

    // Contact
    { s: Section.C, j: 'contactName', w: 'Name' },
    { s: Section.C, j: 'contactPhone', w: 'Telephone' },
    { s: Section.C, j: 'contactFax', w: 'Fax' },
    { s: Section.C, j: 'contactEmail', w: 'Email Address' },
    { s: Section.C, j: 'contactStreet', w: 'Street' },
    { s: Section.C, j: 'contactCity', w: 'City' },
    { s: Section.C, j: 'contactState', w: 'State' },
    { s: Section.C, j: 'contactZip', w: 'Zip Code' },
    { s: Section.C, j: 'notesOnApplying', w: 'Notes on Applying' }
];

/**
 * Scrape a job detail page (StateJobsNY) and return an object with the results
 */
export async function fetchJobDataFromURL(url: string): Promise<Partial<Job>> {
    const { data: html } = await axios.get(url);
    if (!html || typeof html !== 'string') throw new Error('Failed to fetch job page');
    const $ = cheerio.load(html);

    const results: Partial<Job> = {};

    // There are four divs on the site, identified by their ids:
    // #information, #schedule, #location, #jobspecifics, #contact

    const sections = ['information', 'schedule', 'location', 'jobspecifics', 'contact'];

    sections.forEach((section) => {
        $(`#${section} p.row`).each((_, el) => {
            const label = $(el).find('.leftCol').text().trim();
            const value = $(el).find('.rightCol').text().trim();

            // Match a definition that has the same section and label
            const match = definitions.find((d) => d.s === section && d.w === label);
            if (!match) return;

            const { j, f, p } = match;
            const parsedValue = f ? f.apply(null, [j, value, ...(p ? p : [])]) : value;
            results[j] = parsedValue;
        });
    });

    results.lastScraped = new Date();

    return results as Partial<Job>;
}

function parseYesNoToBoolean(key: string, value: string): boolean {
    if (value.toLowerCase() === 'yes') return true;
    else if (value.toLowerCase() === 'no') return false;
    else {
        console.warn(`Value for ${key} should be YES or NO, but it's ${value}`);
        return false;
    }
}

function parsePercentToNumber(key: string, value: string): number {
    // 75% -> 75
    const percentAsNumber = parseFloat(value.replace('%', ''));
    return percentAsNumber;
}
