import { Infer, v } from 'convex/values';
import { mutation } from '../../_generated/server';
import { SuccessData } from '../../response/success';
import authorization from '../../middleware/authorization';
import chatModel from '../chat/model';
import { vChatUserMessage } from '../chat/validator';
import { internal } from '../../_generated/api';
import { ludwigAgentOptions, ludwigAgentToolFnSet } from './ai/agent';

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

		const [chat, chatMessages] = await Promise.all([
			chatModel.getChatById(ctx, chatId),
			chatModel.getChatMessages(ctx, {
				workspaceId,
				chatId
			})
		]);

		let ludwigDesignContext = ``;

		const contextParts = [];
		if (chat?.projectId) contextParts.push(`The project ID is ${chat.projectId}`);

		if (chat?.designId) contextParts.push(`The design ID is ${chat.designId}`);

		if (contextParts.length > 0) ludwigDesignContext = contextParts.join('\n') + '\n';

		await ctx.scheduler.runAfter(0, internal.v1.chat.internal.action.streamChatResponse, {
			workspaceId,
			userId,
			chatId,
			agentOptions: {
				...ludwigAgentOptions,
				system: ludwigDesignContext + ludwigAgentOptions.system
			},
			agentToolFnSet: ludwigAgentToolFnSet,
			messages: chatMessages.map((message) => message.message)
		});

		return SuccessData({ chatId });
	}
});
