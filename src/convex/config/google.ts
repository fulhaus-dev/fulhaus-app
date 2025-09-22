import { createGoogleGenerativeAI } from '@ai-sdk/google';

const googleGemini = createGoogleGenerativeAI({
	apiKey: process.env.GOOGLE_GEMINI_API_KEY
});

export const googleGemini2_5FlashLlm = googleGemini.languageModel('gemini-2.5-flash');

export const googleGemini2_5FlashChat = googleGemini.chat('gemini-2.5-flash');

export const googleGemini2_5ProChat = googleGemini.chat('gemini-2.5-pro');

export const googleGemini2_5FlashImagePreviewImm = googleGemini('gemini-2.5-flash-image-preview');
