import { Id } from '../../_generated/dataModel';
import { MutationCtx, QueryCtx } from '../../_generated/server';
import date from '../../util/date';
import userPermissionModel from '../user/permission/model';

async function createWorkspace(
	ctx: MutationCtx,
	{ name, userId }: { name: string; userId: Id<'users'> }
) {
	const workspaceId = await ctx.db.insert('workspaces', {
		name,
		members: [],
		createdById: userId,
		updatedById: userId,
		updatedAt: date.now()
	});

	return workspaceId;
}

async function getWorkspaceById(ctx: QueryCtx, workspaceId: Id<'workspaces'>) {
	return await ctx.db.get(workspaceId);
}

async function getUserWorkspaces(ctx: QueryCtx, userId: Id<'users'>) {
	const userWorkspaceIds = await userPermissionModel.getUserWorkspaceIds(ctx, userId);
	if (!userWorkspaceIds || userWorkspaceIds.length < 1) return [];

	return await Promise.all(
		userWorkspaceIds.map((workspaceId) => getWorkspaceById(ctx, workspaceId))
	);
}

const workspaceModel = {
	createWorkspace,
	getWorkspaceById,
	getUserWorkspaces
};
export default workspaceModel;
