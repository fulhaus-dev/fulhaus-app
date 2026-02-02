import { Id } from '../../../../_generated/dataModel';
import { MutationCtx, QueryCtx } from '../../../../_generated/server';
import userModel from '../../../user/model';

async function saveCreditPoolMember(
	ctx: MutationCtx,
	args: { userId: Id<'users'>; poolId: Id<'creditPools'> }
) {
	const creditPoolMember = await getCreditPoolMemberByUserPoolId(ctx, args);
	if (creditPoolMember) return creditPoolMember._id;

	return await ctx.db.insert('creditPoolMembers', {
		userId: args.userId,
		poolId: args.poolId,
		active: true,
		totalUsed: 0
	});
}

async function getCreditPoolMemberByUserPoolId(
	ctx: QueryCtx,
	args: { userId: Id<'users'>; poolId: Id<'creditPools'> }
) {
	return await ctx.db
		.query('creditPoolMembers')
		.withIndex('by_credit_pool_member', (q) =>
			q.eq('userId', args.userId).eq('poolId', args.poolId)
		)
		.first();
}

async function getCreditPoolMembersByUserId(ctx: QueryCtx, userId: Id<'users'>) {
	return await ctx.db
		.query('creditPoolMembers')
		.withIndex('by_credit_pool_member', (q) => q.eq('userId', userId))
		.collect();
}

async function updateCreditPoolMemberByUserPoolId(
	ctx: MutationCtx,
	args: {
		userId: Id<'users'>;
		poolId: Id<'creditPools'>;
		update: { active?: boolean; totalUsed?: number };
	}
) {
	const { userId, poolId, update } = args;

	const creditPoolMember = await getCreditPoolMemberByUserPoolId(ctx, { userId, poolId });
	if (!creditPoolMember) return;

	return await ctx.db.patch(creditPoolMember._id, update);
}

async function getCreditPoolMembersByPoolId(ctx: QueryCtx, poolId: Id<'creditPools'>) {
	const creditPoolMembers = await ctx.db
		.query('creditPoolMembers')
		.withIndex('by_credit_pool', (q) => q.eq('poolId', poolId))
		.collect();

	return await Promise.all(
		creditPoolMembers.map(async (creditPoolMember) => ({
			...creditPoolMember,
			user: await userModel.getUserById(ctx, creditPoolMember.userId)
		}))
	);
}

const creditPoolMemberModel = {
	saveCreditPoolMember,
	getCreditPoolMemberByUserPoolId,
	getCreditPoolMembersByUserId,
	updateCreditPoolMemberByUserPoolId,
	getCreditPoolMembersByPoolId
};

export default creditPoolMemberModel;
