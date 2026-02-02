import { Infer } from 'convex/values';
import { vUpdateCreditPoolValidator } from './validator';
import { MutationCtx, QueryCtx } from '../../../_generated/server';
import date from '../../../util/date';
import { Id } from '../../../_generated/dataModel';
import creditPoolMemberModel from './member/model';

async function createCreditPool(ctx: MutationCtx, args: Infer<typeof vUpdateCreditPoolValidator>) {
	return await ctx.db.insert('creditPools', {
		...args,
		updatedAt: date.now()
	});
}

async function getCreditPoolById(ctx: QueryCtx, creditPoolId: Id<'creditPools'>) {
	return await ctx.db.get(creditPoolId);
}

async function getAvailableCreditPoolsByUserId(ctx: QueryCtx, userId: Id<'users'>) {
	const creditPoolMembers = await creditPoolMemberModel.getCreditPoolMembersByUserId(ctx, userId);

	const creditPools = await Promise.all(
		creditPoolMembers.map((creditPoolMember) => getCreditPoolById(ctx, creditPoolMember.poolId))
	);

	const availableCreditPools = creditPools
		.filter((creditPool) => creditPool !== null && creditPool.credit > creditPool.used)
		.map((creditPool) => creditPool!.name);

	if (availableCreditPools.length < 1) return;

	return availableCreditPools;
}

async function updateCreditPoolCreditsUsed(
	ctx: MutationCtx,
	args: { poolId: Id<'creditPools'>; creditsUsed: number }
) {
	const { poolId, creditsUsed } = args;

	const creditPool = await getCreditPoolById(ctx, poolId);
	if (!creditPool) return;

	await ctx.db.patch(poolId, { used: creditPool.used + creditsUsed });
}

const creditPoolModel = {
	createCreditPool,
	getCreditPoolById,
	getAvailableCreditPoolsByUserId,
	updateCreditPoolCreditsUsed
};

export default creditPoolModel;
