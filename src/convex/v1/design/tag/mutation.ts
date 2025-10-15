import { v } from 'convex/values';
import { mutation } from '../../../_generated/server';
import authorization from '../../../middleware/authorization';
import designTagModel from './model';

export const saveDesignTags = mutation({
	args: {
		workspaceId: v.id('workspaces'),
		designId: v.id('designs'),
		tagNames: v.array(v.string())
	},
	handler: async (ctx, args) => {
		await authorization.workspaceMemberIsAuthorizedToPerformFunction(
			ctx,
			args.workspaceId,
			'createDesign'
		);

		await designTagModel.saveDesignTags(ctx, args.workspaceId, args.designId, args.tagNames);
	}
});

export const deleteDesignTag = mutation({
	args: {
		workspaceId: v.id('workspaces'),
		designTagId: v.id('designTags')
	},
	handler: async (ctx, args) => {
		await authorization.workspaceMemberIsAuthorizedToPerformFunction(
			ctx,
			args.workspaceId,
			'createDesign'
		);

		await designTagModel.deleteDesignTag(ctx, args.designTagId);
	}
});
