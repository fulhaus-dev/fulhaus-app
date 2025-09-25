import { mutation } from '../../_generated/server';
import authorization from '../../middleware/authorization';
import { v } from 'convex/values';
import { vUpdateDesign } from './validator';
import designModel from './model';
import { internal } from '../../_generated/api';
import object from '../../util/object';

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

		const currentDesign = await designModel.getDesignById(ctx, args.designId);
		if (!currentDesign) return;

		const updates = args.updates;
		const dataToUpdate = object.getDifference(currentDesign, updates);

		await designModel.updateDesignById(ctx, args.designId, userId, dataToUpdate);

		if (dataToUpdate.productCategories || dataToUpdate.inspirationImageUrl) {
			await ctx.scheduler.runAfter(
				0,
				internal.v1.design.internal.action.generateDesignFurnitureRecommendation,
				{
					designId: args.designId,
					userId
				}
			);
		}
	}
});
