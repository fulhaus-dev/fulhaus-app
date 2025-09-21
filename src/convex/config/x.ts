import { createXai } from '@ai-sdk/xai';

const xai = createXai({
	apiKey: process.env.XAI_API_KEY
});

export const xaiGrok4FastReasoningChat = xai.chat('grok-4-fast-reasoning');
