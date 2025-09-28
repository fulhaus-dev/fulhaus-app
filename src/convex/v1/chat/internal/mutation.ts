import { v } from 'convex/values';
import { internalMutation } from '../../../_generated/server';
import chatModel from '../model';

import { vChatAssistantMessage, vChatToolMessage, vLlmUsage } from '../validator';

export const saveChatAssistantResponse = internalMutation({
	args: {
		workspaceId: v.id('workspaces'),
		userId: v.id('users'),
		chatId: v.id('chats'),
		message: v.union(vChatAssistantMessage, vChatToolMessage),
		usage: v.optional(vLlmUsage)
	},
	handler: async (ctx, args) => await chatModel.saveChatMessage(ctx, args)
});

export const saveChatResponseStream = internalMutation({
	args: {
		workspaceId: v.id('workspaces'),
		chatId: v.id('chats'),
		stream: v.any()
	},
	handler: async (ctx, args) => await chatModel.saveChatResponseStream(ctx, args)
});

export const deleteChatResponseStreams = internalMutation({
	args: {
		workspaceId: v.id('workspaces'),
		chatId: v.id('chats')
	},
	handler: async (ctx, args) => await chatModel.deleteChatResponseStreams(ctx, args)
});

export const updateChatById = internalMutation({
	args: {
		chatId: v.id('chats'),
		designId: v.optional(v.id('designs'))
	},
	handler: async (ctx, args) => {
		const { chatId, ...update } = args;
		await chatModel.updateChatById(ctx, chatId, update);
	}
});
