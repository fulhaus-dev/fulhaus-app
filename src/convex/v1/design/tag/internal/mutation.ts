import { v } from 'convex/values';
import designTagModel from '../model';
import { internalMutation } from '../../../../_generated/server';

export const saveDesignTags = internalMutation({
	args: {
		workspaceId: v.id('workspaces'),
		designId: v.id('designs'),
		tags: v.array(v.string())
	},
	handler: async (ctx, args) => {
		return await designTagModel.saveDesignTags(ctx, args.workspaceId, args.designId, args.tags);
	}
});
