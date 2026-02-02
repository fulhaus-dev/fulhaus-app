import { v } from 'convex/values';
import creditPoolMemberModel from './model';
import { query } from '../../../../_generated/server';
import { SuccessData } from '../../../../response/success';

export const getCreditPoolMembersByPoolId = query({
	args: {
		poolId: v.id('creditPools')
	},
	handler: async (ctx, args) => {
		const creditPoolMembers = await creditPoolMemberModel.getCreditPoolMembersByPoolId(
			ctx,
			args.poolId
		);

		return SuccessData({ creditPoolMembers });
	}
});
