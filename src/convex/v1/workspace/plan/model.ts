import { internal } from '../../../_generated/api';
import { Id } from '../../../_generated/dataModel';
import { MutationCtx, QueryCtx } from '../../../_generated/server';
import { CurrencyCode } from '../../../type';
import creditPoolMemberUsageModel from '../../credit/pool/member/usage/model';
import creditPoolModel from '../../credit/pool/model';
import userPermissionModel from '../../user/permission/model';
import { planCredits } from './constant';
import { UpdateWorkspacePlan } from './type';

async function createWorkspacePlan(
	ctx: MutationCtx,
	args: { userId: Id<'users'>; currencyCode: CurrencyCode; workspaceId: Id<'workspaces'> }
) {
	const workspacePlanId = await ctx.db.insert('workspacePlans', {
		workspaceId: args.workspaceId,
		plan: 'Free',
		credit: planCredits['Free'],
		used: 0
	});

	await updateStripeUserWorkspacePlan(ctx, args);

	return workspacePlanId;
}

async function updateStripeUserWorkspacePlan(
	ctx: MutationCtx,
	args: {
		userId: Id<'users'>;
		currencyCode: CurrencyCode;
		workspaceId: Id<'workspaces'>;
		delayMultiplier?: number;
	}
) {
	const { userId, currencyCode, delayMultiplier = 1 } = args;

	const userPermissions = await userPermissionModel.getUserPermissions(ctx, userId);
	const ownerWorkspaceIds = userPermissions
		.filter((permission) => permission.permission === 'workspace.owner')
		.map((permission) => permission.workspaceId);

	const ownerWorkspacePlans = await Promise.all(
		ownerWorkspaceIds.map((workspaceId) =>
			getWorkspacePlanByWorkspaceId(ctx, { workspaceId, userId })
		)
	);

	await ctx.scheduler.runAfter(
		21000 * delayMultiplier,
		internal.v1.payment.internal.action.updateStripeCustomer,
		{
			userId,
			currencyCode,
			updates: {
				metadata: {
					plan: ownerWorkspacePlans
						.filter((plan) => !!plan.workspacePlan)
						.map(
							(ownerWorkspacePlan) =>
								`${ownerWorkspacePlan.workspacePlan!.workspaceId}:${ownerWorkspacePlan.workspacePlan!.plan} - ${ownerWorkspacePlan.workspacePlan!.used}/${ownerWorkspacePlan.workspacePlan!.credit}`
						)
						.join(', ')
				}
			}
		}
	);
}

async function getWorkspacePlanById(ctx: QueryCtx, workspacePlanId: Id<'workspacePlans'>) {
	return await ctx.db.get(workspacePlanId);
}

async function getWorkspacePlanByWorkspaceId(
	ctx: QueryCtx,
	args: { workspaceId: Id<'workspaces'>; userId: Id<'users'> }
) {
	const workspacePlan = await ctx.db
		.query('workspacePlans')
		.withIndex('workspace_id', (q) => q.eq('workspaceId', args.workspaceId))
		.first();

	const availableCreditPools = await creditPoolModel.getAvailableCreditPoolsByUserId(
		ctx,
		args.userId
	);

	return {
		workspacePlan,
		availableCreditPools
	};
}

async function updateWorkspacePlanByWorkspaceId(
	ctx: MutationCtx,
	args: {
		workspaceId: Id<'workspaces'>;
		userId: Id<'users'>;
		currencyCode: CurrencyCode;
		update: UpdateWorkspacePlan;
	}
) {
	const { workspaceId, userId, currencyCode, update } = args;

	const { workspacePlan } = await getWorkspacePlanByWorkspaceId(ctx, { workspaceId, userId });
	if (!workspacePlan) return;

	const isNewCredit = update.credit !== undefined;

	const newUpdate = {
		...args,
		credit: isNewCredit
			? workspacePlan.credit - workspacePlan.used + (update.credit ?? 0)
			: workspacePlan.credit,
		used: isNewCredit ? 0 : workspacePlan.used
	};

	if (update.plan === 'Free' && workspacePlan.stripeSubscriptionId)
		update.stripeSubscriptionId = undefined;

	await ctx.db.patch(workspacePlan._id, newUpdate);

	if (update.plan === 'Free' && workspacePlan.stripeSubscriptionId)
		await ctx.scheduler.runAfter(0, internal.v1.payment.internal.action.cancelSubscription, {
			subscriptionId: workspacePlan.stripeSubscriptionId
		});

	if (
		update.plan !== 'Free' &&
		workspacePlan.stripeSubscriptionId &&
		update.stripeSubscriptionId &&
		update.stripeSubscriptionId !== workspacePlan.stripeSubscriptionId
	)
		await ctx.scheduler.runAfter(0, internal.v1.payment.internal.action.cancelSubscription, {
			subscriptionId: workspacePlan.stripeSubscriptionId
		});

	await updateStripeUserWorkspacePlan(ctx, {
		userId,
		currencyCode,
		workspaceId
	});
}

async function updateWorkspaceCreditsUsed(
	ctx: MutationCtx,
	args: { workspaceId: Id<'workspaces'>; userId: Id<'users'>; creditsUsed: number }
) {
	const { workspaceId, userId, creditsUsed } = args;

	const { workspacePlan, availableCreditPools = [] } = await getWorkspacePlanByWorkspaceId(ctx, {
		workspaceId,
		userId
	});

	if (availableCreditPools.length > 0)
		await creditPoolMemberUsageModel.saveCreditPoolMemberUsage(ctx, {
			userId,
			usage: creditsUsed
		});

	if (!workspacePlan || availableCreditPools?.length > 0) return;

	const update = {
		used: workspacePlan.used + creditsUsed
	};

	await ctx.db.patch(workspacePlan._id, update);
}

const workspacePlanModel = {
	createWorkspacePlan,
	getWorkspacePlanById,
	getWorkspacePlanByWorkspaceId,
	updateWorkspacePlanByWorkspaceId,
	updateWorkspaceCreditsUsed,
	updateStripeUserWorkspacePlan
};
export default workspacePlanModel;
