import { v } from 'convex/values';
import { query } from '../../_generated/server';
import chatModel from './model';
import authorization from '../../middleware/authorization';
import { SuccessData } from '../../response/success';

export const getChatUiMessagesAndUsers = query({
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

		const chatUiMessagesAndUsers = await chatModel.getChatUiMessagesAndUsers(ctx, args);

		return SuccessData(chatUiMessagesAndUsers);
	}
});
