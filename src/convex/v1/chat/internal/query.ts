import { v } from 'convex/values';
import { internalQuery } from '../../../_generated/server';
import chatModel from '../model';

export const getChatMessages = internalQuery({
	args: {
		workspaceId: v.id('workspaces'),
		chatId: v.id('chats')
	},
	handler: async (ctx, args) => {
		return await chatModel.getChatMessageHistory(ctx, {
			workspaceId: args.workspaceId,
			chatId: args.chatId
		});
	}
});
