import { Id } from '../_generated/dataModel';
import { MutationCtx, QueryCtx } from '../_generated/server';
import ServerError from '../response/error';
import { FunctionName } from '../type';
import userPermissionModel from '../v1/user/permission/model';

async function userIsAuthenticated(ctx: MutationCtx | QueryCtx) {
	const userIdentity = await ctx.auth.getUserIdentity();
	if (!userIdentity) throw ServerError.Unauthorized();

	return userIdentity?.userId as Id<'users'>;
}

async function userIsWorkspaceMember(ctx: MutationCtx | QueryCtx, workspaceId: Id<'workspaces'>) {
	const userId = await userIsAuthenticated(ctx);

	const userIsMemberOfWorkspace = await userPermissionModel.isMemberOfWorkspace(ctx, {
		userId,
		workspaceId
	});
	if (!userIsMemberOfWorkspace)
		throw ServerError.Unauthorized('You are not a member of this workspace.');

	return userId;
}

async function workspaceMemberIsAuthorizedToPerformFunction(
	ctx: MutationCtx | QueryCtx,
	workspaceId: Id<'workspaces'>,
	functionName: FunctionName
) {
	const userId = await userIsAuthenticated(ctx);

	const userIsAuthorizedToPerformFunction = await userPermissionModel.isAuthorizedToPerformFunction(
		ctx,
		functionName,
		{
			userId,
			workspaceId
		}
	);
	if (!userIsAuthorizedToPerformFunction)
		throw ServerError.Unauthorized('You are not a authorized to perform this action.');

	return userId;
}

const authorization = {
	userIsAuthenticated,
	userIsWorkspaceMember,
	workspaceMemberIsAuthorizedToPerformFunction
};
export default authorization;
