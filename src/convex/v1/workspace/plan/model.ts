import { Infer } from 'convex/values';
import { Id } from '../../../_generated/dataModel';
import { MutationCtx, QueryCtx } from '../../../_generated/server';
import { vUpdateWorkspacePlan } from './validator';

async function createWorkspacePlan(ctx: MutationCtx, workspaceId: Id<'workspaces'>) {
	return await ctx.db.insert('workspacePlans', {
		workspaceId,
		plan: 'Free',
		credit: 200,
		used: 0
	});
}

async function getWorkspacePlanById(ctx: QueryCtx, workspacePlanId: Id<'workspacePlans'>) {
	return await ctx.db.get(workspacePlanId);
}

async function getWorkspacePlan(ctx: QueryCtx, workspaceId: Id<'workspaces'>) {
	return await ctx.db
		.query('workspacePlans')
		.withIndex('workspace_id', (q) => q.eq('workspaceId', workspaceId))
		.first();
}

async function updateWorkspacePlanByWorkspaceId(
	ctx: MutationCtx,
	workspaceId: Id<'workspaces'>,
	args: Infer<typeof vUpdateWorkspacePlan>
) {
	const workspacePlan = await getWorkspacePlan(ctx, workspaceId);
	if (!workspacePlan) return;

	return await ctx.db.patch(workspacePlan._id, args);
}

const workspacePlanModel = {
	createWorkspacePlan,
	getWorkspacePlanById,
	getWorkspacePlan,
	updateWorkspacePlanByWorkspaceId
};
export default workspacePlanModel;
