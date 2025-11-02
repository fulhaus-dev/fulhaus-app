import { v } from 'convex/values';
import { mutation } from '../../../_generated/server';
import authorization from '../../../middleware/authorization';
import designTagModel from './model';

export const saveDesignTags = mutation({
	args: {
		workspaceId: v.id('workspaces'),
		data: v.array(
			v.object({
				designId: v.id('designs'),
				tagNames: v.array(v.string())
			})
		)
	},
	handler: async (ctx, args) => {
		await authorization.workspaceMemberIsAuthorizedToPerformFunction(
			ctx,
			args.workspaceId,
			'createDesign'
		);

		const newTagIds = await Promise.all(
			args.data.map((data) =>
				designTagModel.saveDesignTags(ctx, args.workspaceId, data.designId, data.tagNames)
			)
		);

		return newTagIds.filter((id) => !!id).flat();
	}
});

export const deleteDesignTags = mutation({
	args: {
		workspaceId: v.id('workspaces'),
		designTagIds: v.array(v.id('designTags'))
	},
	handler: async (ctx, args) => {
		await authorization.workspaceMemberIsAuthorizedToPerformFunction(
			ctx,
			args.workspaceId,
			'createDesign'
		);

		await Promise.all(args.designTagIds.map((id) => designTagModel.deleteDesignTag(ctx, id)));
	}
});
