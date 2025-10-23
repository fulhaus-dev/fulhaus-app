import { internal } from '../../../_generated/api';
import { httpAction } from '../../../_generated/server';
import httpAuthorization from '../../../middleware/http/authorization';
import ServerError from '../../../response/error';
import { CurrencyCode } from '../../../type';
import { ProductCategory, ProductRecommendationFilter } from '../type';

type LudwigProductRecommendationsByCategoryBodyArgs = {
	currencyCode: CurrencyCode;
	categoryList: {
		category: ProductCategory;
		imageEmbedding: number[];
		filter?: ProductRecommendationFilter;
	}[];
	limit: number;
};

export const getLudwigProductRecommendationsByCategory = httpAction(async (ctx, request) => {
	const ludwigApiKey = request.headers.get('x-ludwig-api-key') ?? undefined;
	if (!ludwigApiKey) throw ServerError.Unauthorized();

	httpAuthorization.authorizeLudwig(ludwigApiKey);

	const data: LudwigProductRecommendationsByCategoryBodyArgs = await request.json();

	const sanitizedCategoryList = data.categoryList.map((categoryData) => ({
		...categoryData,
		filter:
			categoryData.filter && Object.keys(categoryData.filter).length > 0
				? categoryData.filter
				: undefined
	}));

	const recommendationResult = await ctx.runAction(
		internal.v1.product.internal.action.getLudwigProductRecommendationsByCategory,
		{
			...data,
			categoryList: sanitizedCategoryList
		}
	);

	return new Response(JSON.stringify(recommendationResult.recommendations), { status: 200 });
});
