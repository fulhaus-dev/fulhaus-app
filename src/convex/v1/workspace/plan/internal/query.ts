import { v } from 'convex/values';
import { internalQuery } from '../../../../_generated/server';
import workspacePlanModel from '../model';

export const getWorkspacePlan = internalQuery({
	args: {
		workspaceId: v.id('workspaces')
	},
	handler: async (ctx, { workspaceId }) => {
		return await workspacePlanModel.getWorkspacePlan(ctx, workspaceId);
	}
});
