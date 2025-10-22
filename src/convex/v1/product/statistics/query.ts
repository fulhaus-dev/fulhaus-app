import { v } from 'convex/values';
import { query } from '../../../_generated/server';
import authorization from '../../../middleware/authorization';
import productStatisticsModel from './model';
import { SuccessData } from '../../../response/success';

export const getAllProductCategoryStatistic = query({
	args: {
		poApiKey: v.string()
	},
	handler: async (ctx, args) => {
		authorization.authorizeProductOnboarding(args.poApiKey);

		const allProductCategoryStatistics =
			await productStatisticsModel.getAllProductCategoryStatistic(ctx);

		return SuccessData(allProductCategoryStatistics);
	}
});
