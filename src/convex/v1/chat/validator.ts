import { v } from 'convex/values';

const vTextUiPart = v.object({
	type: v.literal('text'),
	text: v.string(),
	state: v.optional(v.union(v.literal('streaming'), v.literal('done')))
});

const vFileUiPart = v.object({
	type: v.literal('file'),
	mediaType: v.string(),
	filename: v.optional(v.string()),
	url: v.string()
});

const vToolUiPart = v.object({
	type: v.string(),
	toolCallId: v.string(),
	state: v.union(
		v.literal('input-streaming'),
		v.literal('input-available'),
		v.literal('output-available'),
		v.literal('output-error')
	),
	input: v.optional(v.any()),
	output: v.optional(v.any()),
	errorText: v.optional(v.string()),
	providerExecuted: v.optional(v.boolean())
});

const vReasoningUiPart = v.object({
	type: v.literal('reasoning'),
	text: v.string(),
	state: v.optional(v.union(v.literal('streaming'), v.literal('done'))),
	providerMetadata: v.optional(v.any())
});

const vSourceUrlUiPart = v.object({
	type: v.literal('source-url'),
	sourceId: v.string(),
	url: v.string(),
	title: v.optional(v.string()),
	providerMetadata: v.optional(v.any())
});

const vDataUiPart = v.object({
	type: v.string(),
	id: v.optional(v.string()),
	data: v.any()
});

const vStepStartUiPart = v.object({
	type: v.literal('step-start')
});

const vUiMessagePart = v.union(
	vTextUiPart,
	vFileUiPart,
	vToolUiPart,
	vReasoningUiPart,
	vSourceUrlUiPart,
	vDataUiPart,
	vStepStartUiPart
);

const vChatMetadata = v.record(v.string(), v.any());

export const vChatUiMessage = v.object({
	id: v.string(),
	role: v.union(v.literal('system'), v.literal('user'), v.literal('assistant')),
	parts: v.array(vUiMessagePart),
	metadata: v.optional(vChatMetadata)
});

export const vChatUsage = v.object({
	inputTokens: v.optional(v.number()),
	outputTokens: v.optional(v.number()),
	toolTokens: v.optional(v.number()),
	reasoningTokens: v.optional(v.number()),
	cachedInputTokens: v.optional(v.number()),
	totalTokens: v.optional(v.number())
});
