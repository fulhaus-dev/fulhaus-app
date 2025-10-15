import { v } from 'convex/values';
import { internalAction } from '../../../_generated/server';
import productModel from '../model';
import { vCurrencyCode } from '../../../validator';
import { vProductCategory, vProductRecommendationFilter } from '../validator';
import { SuccessData } from '../../../response/success';

export const getLudwigProductRecommendationsByCategory = internalAction({
	args: {
		currencyCode: vCurrencyCode,
		categoryList: v.array(
			v.object({
				category: vProductCategory,
				imageEmbedding: v.array(v.float64()),
				filter: v.optional(vProductRecommendationFilter)
			})
		),
		limit: v.number()
	},
	handler: async (ctx, args) => {
		const recommendationResult = await Promise.all(
			args.categoryList.map((data) =>
				productModel.getLudwigProductRecommendationByCategory(ctx, {
					imageEmbedding: data.imageEmbedding,
					category: data.category,
					currencyCode: args.currencyCode,
					limit: args.limit,
					filter: data.filter
				})
			)
		);

		return SuccessData(
			recommendationResult.map((result, index) => ({
				result,
				category: args.categoryList[index].category
			}))
		);
	}
});
