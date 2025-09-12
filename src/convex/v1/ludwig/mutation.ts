import { Infer, v } from 'convex/values';
import { mutation } from '../../_generated/server';
import { SuccessData } from '../../response/success';
import authorization from '../../middleware/authorization';
import chatModel from '../chat/model';
import { vChatUserMessage } from '../chat/validator';
import { internal } from '../../_generated/api';

export const streamLudwigChatResponse = mutation({
	args: {
		workspaceId: v.id('workspaces'),
		chatId: v.optional(v.id('chats')),
		prompt: v.string()
	},
	handler: async (ctx, args) => {
		const userId = await authorization.workspaceMemberIsAuthorizedToPerformFunction(
			ctx,
			args.workspaceId,
			'createDesign'
		);

		const { workspaceId, prompt } = args;

		let chatId = args.chatId;
		if (!chatId) chatId = await chatModel.createChat(ctx, { workspaceId, userId });

		await authorization.isWorkspaceChat(ctx, workspaceId, chatId);

		const userMessage: Infer<typeof vChatUserMessage> = {
			role: 'user',
			content: prompt
		};

		await chatModel.saveChatMessage(ctx, {
			workspaceId,
			userId,
			chatId,
			message: userMessage
		});

		const chatMessages = await chatModel.getChatMessages(ctx, {
			workspaceId,
			chatId
		});

		await ctx.scheduler.runAfter(0, internal.v1.chat.internal.action.streamChatResponse, {
			workspaceId,
			userId,
			chatId,
			messages: chatMessages.map((message) => message.message)
		});

		return SuccessData({ chatId });
	}
});
