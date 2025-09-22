import { v } from 'convex/values';
import { internalQuery } from '../../../../_generated/server';
import designProductModel from '../model';

export const getDesignProductsByChatId = internalQuery({
	args: {
		chatId: v.id('chats')
	},
	handler: async (ctx, args) => await designProductModel.getDesignProductsByChatId(ctx, args.chatId)
});
