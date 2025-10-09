import { v } from 'convex/values';
import { internalMutation } from '../../../_generated/server';
import chatModel from '../model';
import { vChatUiMessage, vChatUsage } from '../validator';

export const createChat = internalMutation({
	args: {
		workspaceId: v.id('workspaces'),
		userId: v.id('users')
	},
	handler: async (ctx, args) => {
		return await chatModel.createChat(ctx, args);
	}
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

export const saveChatUsage = internalMutation({
	args: {
		workspaceId: v.id('workspaces'),
		chatId: v.id('chats'),
		usage: vChatUsage
	},
	handler: async (ctx, args) => await chatModel.saveChatUsage(ctx, args)
});

export const saveChatUiMessage = internalMutation({
	args: {
		workspaceId: v.id('workspaces'),
		userId: v.id('users'),
		chatId: v.id('chats'),
		message: vChatUiMessage
	},
	handler: async (ctx, args) => await chatModel.saveChatUiMessage(ctx, args)
});
