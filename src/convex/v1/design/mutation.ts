import { mutation } from '../../_generated/server';
import authorization from '../../middleware/authorization';
import { v } from 'convex/values';
import { vUpdateDesign } from './validator';
import designModel from './model';

export const updateDesignById = mutation({
	args: {
		workspaceId: v.id('workspaces'),
		designId: v.id('designs'),
		updates: vUpdateDesign
	},
	handler: async (ctx, args) => {
		const userId = await authorization.workspaceMemberIsAuthorizedToPerformFunction(
			ctx,
			args.workspaceId,
			'createDesign'
		);

		return await designModel.updateDesignById(ctx, args.designId, userId, args.updates);
	}
});
