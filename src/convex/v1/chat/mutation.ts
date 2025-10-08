import { v } from 'convex/values';
import { mutation } from '../../_generated/server';
import chatModel from './model';
import authorization from '../../middleware/authorization';
import { SuccessData } from '../../response/success';

export const createChat = mutation({
	args: {
		workspaceId: v.id('workspaces')
	},
	handler: async (ctx, { workspaceId }) => {
		const userId = await authorization.workspaceMemberIsAuthorizedToPerformFunction(
			ctx,
			workspaceId,
			'createDesign'
		);

		const chatId = await chatModel.createChat(ctx, { workspaceId, userId });

		return SuccessData({ chatId });
	}
});
