import { v } from 'convex/values';
import creditPoolModel from './model';
import { query } from '../../../_generated/server';
import { SuccessData } from '../../../response/success';
import ServerError from '../../../response/error';

export const getCreditPoolById = query({
	args: {
		poolId: v.id('creditPools')
	},
	handler: async (ctx, args) => {
		const creditPool = await creditPoolModel.getCreditPoolById(ctx, args.poolId);
		if (!creditPool) throw ServerError.NotFound('Credit pool does not exist.');

		return SuccessData(creditPool);
	}
});
