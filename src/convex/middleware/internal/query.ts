import { v } from 'convex/values';
import { internalQuery } from '../../_generated/server';
import userPermissionModel from '../../v1/user/permission/model';
import { vFunctionName } from '../../validator';

export const workspaceMemberIsAuthorizedToPerformFunction = internalQuery({
	args: {
		userId: v.id('users'),
		workspaceId: v.id('workspaces'),
		functionName: vFunctionName
	},
	handler: async (ctx, { userId, workspaceId, functionName }) => {
		return await userPermissionModel.isAuthorizedToPerformFunction(ctx, functionName, {
			userId,
			workspaceId
		});
	}
});
