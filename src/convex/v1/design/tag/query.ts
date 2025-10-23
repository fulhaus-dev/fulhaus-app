import { v } from 'convex/values';
import { query } from '../../../_generated/server';
import authorization from '../../../middleware/authorization';
import designTagModel from './model';
import { SuccessData } from '../../../response/success';

export const getDesignTagsForWorkspace = query({
	args: {
		workspaceId: v.id('workspaces')
	},
	handler: async (ctx, args) => {
		await authorization.userIsAuthenticated(ctx);

		const designTags = await designTagModel.getDesignTagsForWorkspace(ctx, args.workspaceId);

		return SuccessData({ designTags });
	}
});
