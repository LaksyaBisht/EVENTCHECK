import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const gemini_api_key = process.env.GEMINI_API_KEY;
const googleAI = new GoogleGenerativeAI(gemini_api_key);
const geminiConfig = {
    temperature: 0.9,
    topP: 1,
    topK: 1,
    maxOutputTokens: 4096,
}

export const geminiModel = googleAI.getGenerativeModel({
    model: 'gemini-2.5-flash-preview-05-20',
    generationConfig: geminiConfig
});

const stripMarkdown = (text) => {
    let cleanedText = text.replace(/(\*\*|__|\*|_|#+\s)/g, '');
    cleanedText = cleanedText.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    return cleanedText;
}

export async function generate(prompt) {
    try {
        const result = await geminiModel.generateContent(prompt);
        const response = result.response;
        const cleanDescripton = stripMarkdown(response.text());
        return cleanDescripton;
    } catch (error) {
        console.error('Error generating description:', error);
        throw new Error('Failed to generate description');
    }
}