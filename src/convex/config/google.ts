import { createGoogleGenerativeAI } from '@ai-sdk/google';

const googleGenerativeAI = createGoogleGenerativeAI({
	apiKey: process.env.GOOGLE_GEMINI_API_KEY
});

export const googleGenerativeAIGemini2_5Flash = googleGenerativeAI('gemini-2.5-flash');

export const googleGenerativeAIGemini2_5FlashImagePreview = googleGenerativeAI(
	'gemini-2.5-flash-image-preview'
);
