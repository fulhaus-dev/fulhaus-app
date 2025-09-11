import { Id } from '../../_generated/dataModel';
import { MutationCtx, QueryCtx } from '../../_generated/server';
import date from '../../util/date';

async function createWorkspace(
	ctx: MutationCtx,
	{ name, userId }: { name: string; userId: Id<'users'> }
) {
	const workspaceId = await ctx.db.insert('workspaces', {
		name,
		members: [],
		createdById: userId,
		updatedById: userId,
		createdAt: date.now(),
		updatedAt: date.now()
	});

	return workspaceId;
}

async function getWorkspaceById(ctx: QueryCtx, workspaceId: Id<'workspaces'>) {
	return await ctx.db.get(workspaceId);
}

const workspaceModel = {
	createWorkspace,
	getWorkspaceById
};
export default workspaceModel;
