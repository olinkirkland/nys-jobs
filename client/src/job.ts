export type Job = {
    // Summary (from RSS feed)
    id: number; // Unique job ID from the RSS feed
    link: string; // URL to the job posting
    title: string; // Job title
    publishDate: Date; // Publication date from RSS
    deadline: Date; // Application deadline from RSS
    grade: string; // Salary grade
    county: string; // Job location
    summaryHash: string; // Hash for the summary content

    // Meta
    lastScraped: Date; // The last time the data was scraped

    // Basics (#information tab)
    nyHelp: string; // NY HELP indicator (Yes/No)
    agency: string; // Agency name
    occupationalCategory: string; // Occupational Category
    salaryGrade: string; // Salary grade number
    bargainingUnit: string; // Bargaining Unit text
    salaryRange: string; // Salary range (e.g., "From $50425 to $50425 Annually")
    employmentType: string; // Full-Time / Part-Time
    appointmentType: string; // Permanent / Temporary / Provisional
    jurisdictionalClass: string; // Jurisdictional Class (e.g., "Other")
    travelPercentage: string; // Travel % (e.g., "25%")

    // Schedule (#schedule tab)
    workweek: string; // Workweek (e.g., "Mon-Fri")
    hoursPerWeek: string; // Hours per week (e.g., "40")
    workdayFrom: string; // Start of workday (e.g., "7 AM")
    workdayTo: string; // End of workday (e.g., "4 PM")
    flextimeAllowed: string; // "Yes"/"No" if flextime allowed
    mandatoryOvertime: string; // "Yes"/"No" if mandatory overtime applies
    compressedWorkweek: string; // "Yes"/"No" if compressed workweek allowed
    telecommutingAllowed: string; // "Yes"/"No" if telecommuting allowed

    // Location (#location tab)
    streetAddress: string; // Full street address (combining multiple spans if needed)
    city: string; // City
    state: string; // State (default NY)
    zipCode: string; // Zip code

    // Job Specifics (#jobspecifics tab)
    dutiesDescription: string; // Full duties description HTML/text
    minimumQualifications: string; // Minimum qualifications HTML/text
    additionalComments: string; // Additional comments HTML/text

    // Contact (#contact tab)
    contactName: string; // Name of contact person
    contactPhone: string; // Telephone number
    contactFax: string; // Fax number
    contactEmail: string; // Email address
    contactStreet: string; // Contact street address (may combine multiple spans)
    contactCity: string; // Contact city
    contactState: string; // Contact state
    contactZip: string; // Contact zip code
    notesOnApplying: string; // Notes for applying (full HTML/text content)

    // Human Readable
    humanReadableAgency: string; // Transformed agency names
};
