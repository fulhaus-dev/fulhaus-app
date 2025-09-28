import { v } from 'convex/values';
import { query } from '../../_generated/server';
import { SuccessData } from '../../response/success';
import authorization from '../../middleware/authorization';
import chatModel from '../chat/model';
import ludwigUiTools from './ai/tool/ui';

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

		const chatMessageHistory = await chatModel.getChatMessageHistory(ctx, {
			workspaceId: args.workspaceId,
			chatId: args.chatId
		});

		const preSanitizedChatMessageHistoryMessages = chatMessageHistory.messages
			.filter((chatMessage) => chatMessage.message.role !== 'system')
			.filter(
				(chatMessage) =>
					!(
						chatMessage.message.role === 'assistant' &&
						typeof chatMessage.message.content !== 'string' &&
						chatMessage.message.content.filter((content) => content.type === 'text').length < 1
					)
			)
			.filter(
				(chatMessage) =>
					!(
						chatMessage.message.role === 'tool' &&
						chatMessage.message.content.filter((content) =>
							Object.keys(ludwigUiTools).includes(content.toolName)
						).length < 1
					)
			);

		let sanitizedChatMessageHistoryMessages = preSanitizedChatMessageHistoryMessages;
		let activeUiToolName: string | undefined = undefined;

		const lastMessage = preSanitizedChatMessageHistoryMessages.slice(-1)[0];
		const secondToTheLastMessage = preSanitizedChatMessageHistoryMessages.slice(-2, -1)[0];

		if (lastMessage.message.role === 'tool')
			activeUiToolName = lastMessage.message.content[0].toolName;

		if (lastMessage.message.role === 'assistant' && secondToTheLastMessage.message.role === 'tool')
			activeUiToolName = secondToTheLastMessage.message.content[0].toolName;

		sanitizedChatMessageHistoryMessages = preSanitizedChatMessageHistoryMessages.filter(
			(chatMessage) => chatMessage.message.role !== 'tool'
		);

		return SuccessData({
			...chatMessageHistory,
			messages: sanitizedChatMessageHistoryMessages,
			activeUiToolName
		});
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
