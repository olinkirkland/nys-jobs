import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

export async function extractJobData(text: string) {
    const prompt = `
Extract structured fields from the job posting. Output JSON only.

Fields:
- semanticJobTitle (string)
- threeBulletPointsDescription (array)
- minQualifications (array)
- prefQualifications (array)
- duties (array)

Text:
"""${text}"""
`;

    const res = await model.generateContent(prompt);
    const unwrappedText = stripCodeBlock(res.response.text());
    try {
        const json = JSON.parse(unwrappedText);
        return json;
    } catch (error) {
        return {};
    }
}

function stripCodeBlock(text: string): string {
    // Replace ```lang ... ``` or ``` ... ``` with just the content inside
    return text.replace(/```(?:\w+)?\n([\s\S]*?)```/g, '$1').trim();
}
