import { Id } from '../../../../../_generated/dataModel';
import { MutationCtx } from '../../../../../_generated/server';
import creditPoolModel from '../../model';
import creditPoolMemberModel from '../model';

async function saveCreditPoolMemberUsage(
	ctx: MutationCtx,
	args: { userId: Id<'users'>; usage: number }
) {
	const creditPoolMembers = await creditPoolMemberModel.getCreditPoolMembersByUserId(
		ctx,
		args.userId
	);
	if (creditPoolMembers.length < 1) return;

	await Promise.all([
		...creditPoolMembers.map((creditPoolMember) =>
			ctx.db.insert('creditPoolMemberUsages', {
				memberId: creditPoolMember._id,
				poolId: creditPoolMember.poolId,
				used: args.usage
			})
		),
		...creditPoolMembers.map((creditPoolMember) =>
			creditPoolMemberModel.updateCreditPoolMemberByUserPoolId(ctx, {
				userId: args.userId,
				poolId: creditPoolMember.poolId,
				update: {
					totalUsed: creditPoolMember.totalUsed + args.usage
				}
			})
		),
		...creditPoolMembers.map((creditPoolMember) =>
			creditPoolModel.updateCreditPoolCreditsUsed(ctx, {
				poolId: creditPoolMember.poolId,
				creditsUsed: args.usage
			})
		)
	]);
}

const creditPoolMemberUsageModel = {
	saveCreditPoolMemberUsage
};

export default creditPoolMemberUsageModel;
