import { Id } from '../../../_generated/dataModel';
import { MutationCtx, QueryCtx } from '../../../_generated/server';
import { FunctionName } from '../../../type';
import { permissionAccess } from './constant';
import { Permission } from './type';

async function createUserPermissions(
	ctx: MutationCtx,
	{
		workspaceId,
		userId,
		permissions
	}: { workspaceId: Id<'workspaces'>; userId: Id<'users'>; permissions: Permission[] }
) {
	return await Promise.all(
		permissions.map((permission) => {
			ctx.db.insert('userPermissions', {
				workspaceId,
				userId,
				permission
			});
		})
	);
}

async function userIsMemberOfWorkspace(
	ctx: QueryCtx,
	params: { workspaceId: Id<'workspaces'>; userId: Id<'users'> }
) {
	const permission = await ctx.db
		.query('userPermissions')
		.withIndex('user_permission', (q) =>
			q.eq('workspaceId', params.workspaceId).eq('userId', params.userId)
		)
		.first();

	return !!permission;
}

async function userIsAuthorizedToPerformFunction(
	ctx: QueryCtx,
	functionName: FunctionName,
	params: { workspaceId: Id<'workspaces'>; userId: Id<'users'> }
) {
	const permissions = await ctx.db
		.query('userPermissions')
		.withIndex('user_permission', (q) =>
			q.eq('workspaceId', params.workspaceId).eq('userId', params.userId)
		)
		.collect();

	return permissions.some((permission) =>
		permissionAccess[functionName].includes(permission.permission)
	);
}

async function getUserWorkspaceIds(ctx: QueryCtx, userId: Id<'users'>) {
	const permissions = await getUserPermissions(ctx, userId);

	return permissions.map((permission) => permission.workspaceId);
}

async function getUserPermissions(ctx: QueryCtx, userId: Id<'users'>) {
	return await ctx.db
		.query('userPermissions')
		.withIndex('user_Id', (q) => q.eq('userId', userId))
		.collect();
}

const userPermissionModel = {
	create: createUserPermissions,
	isMemberOfWorkspace: userIsMemberOfWorkspace,
	isAuthorizedToPerformFunction: userIsAuthorizedToPerformFunction,
	getUserPermissions,
	getUserWorkspaceIds
};

export default userPermissionModel;
