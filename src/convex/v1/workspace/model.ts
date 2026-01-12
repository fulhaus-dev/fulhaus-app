import { Infer } from 'convex/values';
import { Id } from '../../_generated/dataModel';
import { MutationCtx, QueryCtx } from '../../_generated/server';
import { CurrencyCode } from '../../type';
import date from '../../util/date';
import userPermissionModel from '../user/permission/model';
import { vUpdateWorkspace } from './validator';
import workspacePlanModel from './plan/model';

async function createWorkspace(
	ctx: MutationCtx,
	args: { name: string; userId: Id<'users'>; currencyCode: CurrencyCode }
) {
	const workspaceId = await ctx.db.insert('workspaces', {
		name: args.name,
		members: [],
		currencyCodes: [args.currencyCode],
		createdById: args.userId,
		updatedById: args.userId,
		updatedAt: date.now()
	});

	await workspacePlanModel.createWorkspacePlan(ctx, {
		workspaceId,
		userId: args.userId,
		currencyCode: args.currencyCode
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

async function updateWorkspace(
	ctx: MutationCtx,
	workspaceId: Id<'workspaces'>,
	args: Infer<typeof vUpdateWorkspace>
) {
	return await ctx.db.patch(workspaceId, args);
}

const workspaceModel = {
	createWorkspace,
	getWorkspaceById,
	getUserWorkspaces,
	updateWorkspace
};
export default workspaceModel;
