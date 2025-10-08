import axios from 'axios';
import * as cheerio from 'cheerio';

export type ScrapeResult = {
    // Basics
    nyHelp: string;
    agency: string;
    title: string;
    occupationalCategory: string;
    salaryGrade: string;
    bargainingUnit: string;
    salaryRange: string;
    employmentType: string;
    appointmentType: string;
    jurisdictionalClass: string;
    travelPercentage: string;

    // Schedule
    workweek: string;
    hoursPerWeek: string;
    workdayFrom: string;
    workdayTo: string;
    flextimeAllowed: string;
    mandatoryOvertime: string;
    compressedWorkweek: string;
    telecommutingAllowed: string;

    // Location
    county: string;
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;

    // Job Specifics
    dutiesDescription: string;
    minimumQualifications: string;
    additionalComments: string;

    // Contact
    contactName: string;
    contactPhone: string;
    contactFax: string;
    contactEmail: string;
    contactStreet: string;
    contactCity: string;
    contactState: string;
    contactZip: string;
    notesOnApplying: string;
};

// Label mappings
const basicsLabels: { [key: string]: keyof ScrapeResult } = {
    'NY HELP': 'nyHelp',
    Agency: 'agency',
    Title: 'title',
    'Occupational Category': 'occupationalCategory',
    'Salary Grade': 'salaryGrade',
    'Bargaining Unit': 'bargainingUnit',
    'Salary Range': 'salaryRange',
    'Employment Type': 'employmentType',
    'Appointment Type': 'appointmentType',
    'Jurisdictional Class': 'jurisdictionalClass',
    'Travel Percentage': 'travelPercentage'
};

const scheduleLabels: { [key: string]: keyof ScrapeResult } = {
    Workweek: 'workweek',
    'Hours Per Week': 'hoursPerWeek',
    From: 'workdayFrom',
    To: 'workdayTo',
    'Flextime allowed?': 'flextimeAllowed',
    'Mandatory overtime?': 'mandatoryOvertime',
    'Compressed workweek allowed?': 'compressedWorkweek',
    'Telecommuting allowed?': 'telecommutingAllowed'
};

const locationLabels: { [key: string]: keyof ScrapeResult } = {
    County: 'county',
    'Street Address': 'streetAddress',
    City: 'city',
    State: 'state',
    'Zip Code': 'zipCode'
};

const jobSpecificsLabels: { [key: string]: keyof ScrapeResult } = {
    'Duties Description': 'dutiesDescription',
    'Minimum Qualifications': 'minimumQualifications',
    'Additional Comments': 'additionalComments'
};

const contactLabels: { [key: string]: keyof ScrapeResult } = {
    Name: 'contactName',
    Telephone: 'contactPhone',
    Fax: 'contactFax',
    'Email Address': 'contactEmail',
    Street: 'contactStreet',
    City: 'contactCity',
    State: 'contactState',
    'Zip Code': 'contactZip',
    'Notes on Applying': 'notesOnApplying'
};

/**
 * Scrape a job detail page (StateJobsNY) and return an object with the results
 */
export async function scrapeJob(url: string): Promise<ScrapeResult> {
    const { data: html } = await axios.get(url);
    if (!html || typeof html !== 'string')
        throw new Error('Failed to fetch job page');
    const $ = cheerio.load(html);

    const results: Partial<ScrapeResult> = {};

    // There are four divs on the site, identified by their ids:
    // #information, #schedule, #location, #jobspecifics, #contact

    const sections = [
        { id: 'information', labels: basicsLabels },
        { id: 'schedule', labels: scheduleLabels },
        { id: 'location', labels: locationLabels },
        { id: 'jobspecifics', labels: jobSpecificsLabels },
        { id: 'contact', labels: contactLabels }
    ];

    sections.forEach((section) => {
        $(`#${section.id} p.row`).each((_, el) => {
            const label = $(el).find('.leftCol').text().trim();
            const value = $(el).find('.rightCol').text().trim();
            const key = section.labels[label];
            if (key) results[key] = value;
        });
    });

    return results as ScrapeResult;
}
