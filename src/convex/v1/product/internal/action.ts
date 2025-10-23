import { v } from 'convex/values';
import { internalAction } from '../../../_generated/server';
import { vCurrencyCode } from '../../../validator';
import { vProductCategory, vProductRecommendationFilter } from '../validator';
import { SuccessData } from '../../../response/success';
import { LudwigRecommendation, ProductCategory, ProductRecommendationFilter } from '../type';
import { CurrencyCode } from '../../../type';
import { internal } from '../../../_generated/api';
import { productsToClientProducts } from '../util';

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
		async function getProductRecommendationByCategory(args: {
			imageEmbedding: number[];
			category: ProductCategory;
			currencyCode: CurrencyCode;
			limit: number;
			filter?: ProductRecommendationFilter;
		}): Promise<LudwigRecommendation[]> {
			const recommendations = await ctx.vectorSearch('productEmbeddings', 'by_image_embedding', {
				vector: args.imageEmbedding,
				limit: args.limit,
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				filter: (q) => q.eq(`category${args.currencyCode.toUpperCase()}` as any, args.category)
			});

			const [products, productEmbeddings] = await Promise.all([
				ctx.runQuery(internal.v1.product.internal.query.getProductsByEmbeddingId, {
					embeddingIds: recommendations.map((record) => record._id)
				}),
				ctx.runQuery(internal.v1.product.embedding.internal.query.getProductEmbeddingsById, {
					embeddingIds: recommendations.map((record) => record._id)
				})
			]);

			const clientProducts = productsToClientProducts(products, args.currencyCode);

			return clientProducts
				.map((product) => ({
					_id: product._id,
					_score: recommendations.find(
						(record) => record._id === products.find((p) => p?._id === product._id)?.embeddingId
					)?._score,
					name: product.name,
					imageUrl: product.mainImageUrl,
					imageEmbedding: productEmbeddings
						.filter((productEmbedding) => !!productEmbedding)
						.find((rec) => rec._id === products.find((p) => p?._id === product._id)?.embeddingId)
						?.imageEmbedding,
					retailPrice: product.retailPrice,
					currencyCode: product.currencyCode
				}))
				.filter(
					(rec) => rec._score !== undefined && rec.imageEmbedding !== undefined
				) as LudwigRecommendation[];
		}

		const recommendationResult = await Promise.all(
			args.categoryList.map((data) =>
				getProductRecommendationByCategory({
					imageEmbedding: data.imageEmbedding,
					category: data.category,
					currencyCode: args.currencyCode,
					limit: args.limit,
					filter: data.filter
				})
			)
		);

		return SuccessData({
			recommendations: recommendationResult.map((result, index) => ({
				result,
				category: args.categoryList[index].category
			}))
		});
	}
});
