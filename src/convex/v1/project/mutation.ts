import { mutation } from '../../_generated/server';
import authorization from '../../middleware/authorization';
import { vUpdateProject } from './validator';
import { v } from 'convex/values';
import projectModel from './model';

export const updateProjectById = mutation({
	args: {
		workspaceId: v.id('workspaces'),
		projectId: v.id('projects'),
		updates: vUpdateProject
	},
	handler: async (ctx, args) => {
		const userId = await authorization.workspaceMemberIsAuthorizedToPerformFunction(
			ctx,
			args.workspaceId,
			'createDesign'
		);

		return await projectModel.updateProjectById(ctx, args.projectId, userId, args.updates);
	}
});
