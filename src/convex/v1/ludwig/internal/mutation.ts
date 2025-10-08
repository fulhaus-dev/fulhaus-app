import { v } from 'convex/values';
import { internalMutation } from '../../../_generated/server';
import ludwigModel from '../model';
import chatModel from '../../chat/model';

export const createChat = internalMutation({
	args: {
		userId: v.id('users'),
		workspaceId: v.id('workspaces')
	},
	handler: async (ctx, { workspaceId, userId }) =>
		await chatModel.createChat(ctx, { workspaceId, userId })
});

export const setLudwigChatTempAssetByChatId = internalMutation({
	args: {
		chatId: v.id('chats'),
		assets: v.object({ inspoImageUrl: v.optional(v.string()), floorPlanFile: v.optional(v.any()) })
	},
	handler: async (ctx, args) =>
		await ludwigModel.setChatTempAssetByChatId(ctx, args.chatId, args.assets)
});

export const deleteLudwigChatTempAssetsByChatId = internalMutation({
	args: {
		chatId: v.id('chats')
	},
	handler: async (ctx, args) => await ludwigModel.deleteChatTempAssetByChatId(ctx, args.chatId)
});
