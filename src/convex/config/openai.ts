import { createOpenAI } from '@ai-sdk/openai';

const openai = createOpenAI({
	apiKey: process.env.OPENAI_API_KEY
});

export const openaiGPT5Mini = openai('gpt-5-mini');
