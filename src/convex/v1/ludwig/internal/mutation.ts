import { v } from 'convex/values';
import { internalMutation } from '../../../_generated/server';
import ludwigModel from '../model';

export const deleteLudwigChatTempAssetsByChatId = internalMutation({
	args: {
		chatId: v.id('chats')
	},
	handler: async (ctx, args) => await ludwigModel.deleteChatTempAssetByChatId(ctx, args.chatId)
});
