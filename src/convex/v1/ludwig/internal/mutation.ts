import { v } from 'convex/values';
import { internalMutation } from '../../../_generated/server';
import ludwigModel from '../model';

export const setLudwigChatTempAssetByChatId = internalMutation({
	args: {
		chatId: v.id('chats'),
		assets: v.object({ inspoImageUrl: v.optional(v.string()), floorPlanFile: v.optional(v.any()) })
	},
	handler: async (ctx, args) => {
		return await ludwigModel.setChatTempAssetByChatId(ctx, args.chatId, args.assets);
	}
});

export const deleteLudwigChatTempAssetsByChatId = internalMutation({
	args: {
		chatId: v.id('chats')
	},
	handler: async (ctx, args) => {
		return await ludwigModel.deleteChatTempAssetByChatId(ctx, args.chatId);
	}
});
