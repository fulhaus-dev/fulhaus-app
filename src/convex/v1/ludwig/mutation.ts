import { Infer, v } from 'convex/values';
import { mutation } from '../../_generated/server';
import { SuccessData } from '../../response/success';
import authorization from '../../middleware/authorization';
import chatModel from '../chat/model';
import { vChatUserContent, vChatUserMessage } from '../chat/validator';
import { internal } from '../../_generated/api';
import ludwigModel from './model';

export const streamLudwigChatResponse = mutation({
	args: {
		workspaceId: v.id('workspaces'),
		chatId: v.optional(v.id('chats')),
		content: vChatUserContent,
		inspoImageUrl: v.optional(v.string()),
		floorPlanUrl: v.optional(v.string())
	},
	handler: async (ctx, args) => {
		const userId = await authorization.workspaceMemberIsAuthorizedToPerformFunction(
			ctx,
			args.workspaceId,
			'createDesign'
		);

		const { workspaceId, content } = args;

		let chatId = args.chatId;
		if (!chatId) chatId = await chatModel.createChat(ctx, { workspaceId, userId });

		await authorization.isWorkspaceChat(ctx, workspaceId, chatId);

		if (args.inspoImageUrl)
			await ludwigModel.setChatTempAssetByChatId(ctx, chatId, {
				inspoImageUrl: args.inspoImageUrl
			});

		if (args.floorPlanUrl)
			await ludwigModel.setChatTempAssetByChatId(ctx, chatId, {
				floorPlanUrl: args.floorPlanUrl
			});

		const userMessage: Infer<typeof vChatUserMessage> = {
			role: 'user',
			content
		};

		await chatModel.saveChatMessage(ctx, {
			workspaceId,
			userId,
			chatId,
			message: userMessage
		});

		const chatContext = await chatModel.getChatContext(ctx, {
			workspaceId,
			chatId
		});

		await ctx.scheduler.runAfter(0, internal.v1.chat.internal.action.streamChatResponse, {
			workspaceId,
			userId,
			chatId,
			agentName: 'Ludwig',
			additionalSystemContext: chatContext.chatDesignContext,
			messages: chatContext.chatMessages.map((message) => message.message)
		});

		return SuccessData({ chatId });
	}
});
