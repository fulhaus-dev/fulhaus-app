import { v } from 'convex/values';
import { query } from '../../../_generated/server';
import authorization from '../../../middleware/authorization';
import workspacePlanModel from './model';
import ServerError from '../../../response/error';
import { SuccessData } from '../../../response/success';

export const getWorkspacePlan = query({
	args: { workspaceId: v.id('workspaces') },
	handler: async (ctx, { workspaceId }) => {
		const userId = await authorization.userIsWorkspaceMember(ctx, workspaceId);

		const { workspacePlan, availableCreditPools } =
			await workspacePlanModel.getWorkspacePlanByWorkspaceId(ctx, { workspaceId, userId });
		if (!workspacePlan && !availableCreditPools)
			throw ServerError.NotFound('Workspace plan does not exist.');

		return SuccessData({ workspacePlan, availableCreditPools });
	}
});
