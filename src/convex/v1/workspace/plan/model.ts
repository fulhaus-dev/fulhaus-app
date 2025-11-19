import { internal } from '../../../_generated/api';
import { Id } from '../../../_generated/dataModel';
import { MutationCtx, QueryCtx } from '../../../_generated/server';
import { planCredits } from './constant';
import { UpdateWorkspacePlan } from './type';

async function createWorkspacePlan(ctx: MutationCtx, workspaceId: Id<'workspaces'>) {
	return await ctx.db.insert('workspacePlans', {
		workspaceId,
		plan: 'Free',
		credit: planCredits['Free'],
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
	args: UpdateWorkspacePlan
) {
	const workspacePlan = await getWorkspacePlan(ctx, workspaceId);
	if (!workspacePlan) return;

	const update = {
		...args,
		credit: workspacePlan.credit + (args.credit ?? 0),
		used: args.credit ? 0 : workspacePlan.used
	};

	if (args.plan === 'Free') update.stripeSubscriptionId = undefined;

	await ctx.db.patch(workspacePlan._id, update);

	if (args.plan === 'Free' && workspacePlan.stripeSubscriptionId)
		await ctx.scheduler.runAfter(0, internal.v1.payment.internal.action.cancelSubscription, {
			subscriptionId: workspacePlan.stripeSubscriptionId
		});

	if (
		args.plan !== 'Free' &&
		workspacePlan.stripeSubscriptionId &&
		args.stripeSubscriptionId &&
		args.stripeSubscriptionId !== workspacePlan.stripeSubscriptionId
	)
		await ctx.scheduler.runAfter(0, internal.v1.payment.internal.action.cancelSubscription, {
			subscriptionId: workspacePlan.stripeSubscriptionId
		});
}

async function updateWorkspaceCreditsUsed(
	ctx: MutationCtx,
	workspaceId: Id<'workspaces'>,
	creditsUsed: number
) {
	const workspacePlan = await getWorkspacePlan(ctx, workspaceId);
	if (!workspacePlan) return;

	const update = {
		used: workspacePlan.used + creditsUsed
	};

	await ctx.db.patch(workspacePlan._id, update);
}

const workspacePlanModel = {
	createWorkspacePlan,
	getWorkspacePlanById,
	getWorkspacePlan,
	updateWorkspacePlanByWorkspaceId,
	updateWorkspaceCreditsUsed
};
export default workspacePlanModel;
