import { v } from 'convex/values';
import { query } from '../../../_generated/server';
import authorization from '../../../middleware/authorization';
import productStatisticsModel from './model';
import { SuccessData } from '../../../response/success';
import { vReturnedSuccessData } from '../../../response/validator';
import { doc } from 'convex-helpers/validators';
import schema from '../../../schema';

export const getPoAllProductCategoryStatistic = query({
	args: {
		poApiKey: v.string()
	},
	returns: vReturnedSuccessData(
		v.object({ stats: v.array(doc(schema, 'productCategoryStatistics')) })
	),
	handler: async (ctx, args) => {
		authorization.authorizeProductOnboarding(args.poApiKey);

		const allProductCategoryStatistics =
			await productStatisticsModel.getAllProductCategoryStatistic(ctx);

		return SuccessData({ stats: allProductCategoryStatistics });
	}
});
