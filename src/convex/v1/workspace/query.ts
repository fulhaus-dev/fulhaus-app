import { v } from 'convex/values';
import { query } from '../../_generated/server';
import { SuccessData } from '../../response/success';
import ServerError from '../../response/error';
import workspaceModel from './model';
import authorization from '../../middleware/authorization';

export const getWorkspaceById = query({
	args: { workspaceId: v.id('workspaces') },
	handler: async (ctx, { workspaceId }) => {
		await authorization.userIsWorkspaceMember(ctx, workspaceId);

		const workspace = await workspaceModel.getWorkspaceById(ctx, workspaceId);
		if (!workspace) throw ServerError.NotFound('Workspace does not exist.');

		return SuccessData(workspace);
	}
});
