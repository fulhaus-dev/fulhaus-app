import { v } from 'convex/values';
import { query } from '../../_generated/server';
import { SuccessData } from '../../response/success';
import authorization from '../../middleware/authorization';
import chatModel from '../chat/model';

export const getLudwigChatMessages = query({
	args: {
		workspaceId: v.id('workspaces'),
		chatId: v.id('chats')
	},
	handler: async (ctx, args) => {
		await Promise.all([
			authorization.workspaceMemberIsAuthorizedToPerformFunction(
				ctx,
				args.workspaceId,
				'getDesign'
			),
			authorization.isWorkspaceChat(ctx, args.workspaceId, args.chatId)
		]);

		const chatMessages = await chatModel.getChatMessageHistory(ctx, {
			workspaceId: args.workspaceId,
			chatId: args.chatId
		});

		return SuccessData(chatMessages);
	}
});

export const getLudwigChatResponseStreams = query({
	args: {
		workspaceId: v.id('workspaces'),
		chatId: v.optional(v.id('chats'))
	},
	handler: async (ctx, args) => {
		if (!args.chatId) return SuccessData([]);

		await Promise.all([
			authorization.workspaceMemberIsAuthorizedToPerformFunction(
				ctx,
				args.workspaceId,
				'getDesign'
			),
			authorization.isWorkspaceChat(ctx, args.workspaceId, args.chatId)
		]);

		const chatResponseStreams = await chatModel.getChatResponseStreams(ctx, {
			workspaceId: args.workspaceId,
			chatId: args.chatId
		});

		return SuccessData(chatResponseStreams);
	}
});
