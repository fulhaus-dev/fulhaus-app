import { v } from 'convex/values';

export const vProviderOptions = v.record(v.string(), v.record(v.string(), v.any()));

export const vTextPart = v.object({
	type: v.literal('text'),
	text: v.string(),
	providerOptions: v.optional(vProviderOptions)
});

export const vImagePart = v.object({
	type: v.literal('image'),
	image: v.union(v.string(), v.bytes()),
	mediaType: v.optional(v.string()),
	providerOptions: v.optional(vProviderOptions)
});

export const vFilePart = v.object({
	type: v.literal('file'),
	data: v.union(v.string(), v.bytes(), v.any()),
	filename: v.optional(v.string()),
	mediaType: v.string(),
	providerOptions: v.optional(vProviderOptions)
});

export const vReasoningPart = v.object({
	type: v.literal('reasoning'),
	text: v.string(),
	providerOptions: v.optional(vProviderOptions)
});

export const vToolCallPart = v.object({
	type: v.literal('tool-call'),
	toolCallId: v.string(),
	toolName: v.string(),
	input: v.any(),
	providerExecuted: v.optional(v.boolean()),
	providerOptions: v.optional(vProviderOptions)
});

export const vToolResultOutput = v.union(
	v.object({ type: v.literal('text'), value: v.string() }),
	v.object({ type: v.literal('json'), value: v.any() }),
	v.object({ type: v.literal('error-text'), value: v.string() }),
	v.object({ type: v.literal('error-json'), value: v.any() }),
	v.object({
		type: v.literal('content'),
		value: v.array(
			v.union(
				v.object({ type: v.literal('text'), text: v.string() }),
				v.object({
					type: v.literal('media'),
					data: v.string(),
					mediaType: v.string()
				})
			)
		)
	})
);

export const vToolResultPart = v.object({
	type: v.literal('tool-result'),
	toolCallId: v.string(),
	toolName: v.string(),
	output: vToolResultOutput,
	providerOptions: v.optional(vProviderOptions)
});

export const vChatUserContent = v.union(
	v.string(),
	v.array(v.union(vTextPart, vImagePart, vFilePart))
);

export const vChatAssistantContent = v.union(
	v.string(),
	v.array(v.union(vTextPart, vFilePart, vReasoningPart, vToolCallPart, vToolResultPart))
);

export const vChatSystemMessage = v.object({
	role: v.literal('system'),
	content: v.string(),
	providerOptions: v.optional(vProviderOptions)
});

export const vChatUserMessage = v.object({
	role: v.literal('user'),
	content: vChatUserContent,
	providerOptions: v.optional(vProviderOptions)
});

export const vChatAssistantMessage = v.object({
	role: v.literal('assistant'),
	content: vChatAssistantContent,
	providerOptions: v.optional(vProviderOptions)
});

export const vChatToolMessage = v.object({
	role: v.literal('tool'),
	content: v.array(vToolResultPart),
	providerOptions: v.optional(vProviderOptions)
});

export const vChatMessage = v.union(
	vChatSystemMessage,
	vChatUserMessage,
	vChatAssistantMessage,
	vChatToolMessage
);

export const vLlmUsage = v.object({
	inputTokens: v.optional(v.number()),
	outputTokens: v.optional(v.number()),
	toolTokens: v.optional(v.number()),
	reasoningTokens: v.optional(v.number()),
	cachedInputTokens: v.optional(v.number()),
	totalTokens: v.optional(v.number())
});

export const vChatResponseStream = v.object({
	type: v.string(),
	id: v.optional(v.string()),
	delta: v.optional(v.string())
});
