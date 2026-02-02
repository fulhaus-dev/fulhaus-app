import { v } from 'convex/values';
import { internalQuery } from '../../../../_generated/server';
import workspacePlanModel from '../model';

export const getWorkspacePlan = internalQuery({
	args: {
		workspaceId: v.id('workspaces'),
		userId: v.id('users')
	},
	handler: async (ctx, { workspaceId, userId }) => {
		return await workspacePlanModel.getWorkspacePlanByWorkspaceId(ctx, { workspaceId, userId });
	}
});
