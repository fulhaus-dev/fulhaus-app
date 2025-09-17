import { v } from 'convex/values';
import { internalQuery } from '../../../_generated/server';
import ludwigModel from '../model';

export const getLudwigChatTempAssetsByChatId = internalQuery({
	args: {
		chatId: v.id('chats')
	},
	handler: async (ctx, args) => await ludwigModel.getChatTempAssetsByChatId(ctx, args.chatId)
});
