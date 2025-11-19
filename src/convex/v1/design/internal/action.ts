import { v } from 'convex/values';
import { ActionCtx, internalAction } from '../../../_generated/server';
import { internal } from '../../../_generated/api';
import { r2 } from '../../../util/r2';
import file from '../../../util/file';
import { Id } from '../../../_generated/dataModel';
import asyncFetch from '../../../util/fetch';
import date from '../../../util/date';
import { getDesignRenderedImage, getDesignStylesFromRenderedImage } from '../../ludwig/ai/util';
import { Product, ProductStyle } from '../../product/type';
import { DesignProductCategory, UpdateDesign } from '../type';
import { CurrencyCode, ErrorData } from '../../../type';
import { LudwigRecommendationResponse } from '../../ludwig/type';
import { vCurrencyCode } from '../../../validator';

export const generateDesignStyles = internalAction({
	args: {
		workspaceId: v.id('workspaces'),
		designId: v.id('designs'),
		renderedImageUrl: v.string()
	},
	handler: async (ctx, { workspaceId, designId, renderedImageUrl }) => {
		const { data: designStyles } = await getDesignStylesFromRenderedImage(renderedImageUrl);
		if (!designStyles) return;

		await ctx.runMutation(internal.v1.design.tag.internal.mutation.saveDesignTags, {
			workspaceId,
			designId,
			tags: designStyles
		});

		return;
	}
});

export const generateDesignFurnitureRecommendation = internalAction({
	args: {
		currencyCode: vCurrencyCode,
		designId: v.id('designs'),
		userId: v.id('users'),
		designBudget: v.optional(v.number())
	},
	handler: async (
		ctx,
		{ currencyCode, designId, userId, designBudget = 0 }
	): Promise<
		| {
				error: {
					statusCode: number;
					message: string;
				};
				data?: undefined;
		  }
		| {
				data: {
					designId: Id<'designs'>;
					message: string;
					totalPrice: number;
				};
				error?: undefined;
		  }
	> => {
		await updateDesignStatus({
			ctx,
			designId,
			userId,
			update: {
				generatingFurnitureRecommendation: true
			}
		});
		const design = await ctx.runQuery(internal.v1.design.internal.query.getDesignById, {
			designId
		});
		if (!design) {
			await updateDesignStatus({
				ctx,
				designId,
				userId,
				update: {
					generatingFurnitureRecommendation: false
				}
			});

			return {
				error: {
					statusCode: 400,
					message:
						'The design with this ID was not found, did you forget to create the design first?'
				}
			};
		}

		const ludwigRecommendedResponse = await getLudwigRecommendedProducts(ctx, {
			inspirationImageUrl: design.inspirationImageUrl,
			spaceType: design.spaceType,
			productCategories: design.productCategories,
			currencyCode,
			designBudget
		});

		let ludwigRecommendedProducts = ludwigRecommendedResponse?.products;

		if (!ludwigRecommendedProducts) {
			const fallbackProductsResponse = await getLudwigRecommendedProductsFallback(ctx, {
				inspirationImageUrl: design.inspirationImageUrl,
				currencyCode: currencyCode,
				productCategories: design.productCategories
			});
			if (fallbackProductsResponse.error) {
				await updateDesignStatus({
					ctx,
					designId,
					userId,
					update: {
						generatingFurnitureRecommendation: false
					}
				});
				return {
					error: {
						statusCode: fallbackProductsResponse.error.statusCode,
						message: fallbackProductsResponse.error.message
					}
				};
			}

			ludwigRecommendedProducts = fallbackProductsResponse.data;
		}

		if (ludwigRecommendedProducts.length < 1) {
			await updateDesignStatus({
				ctx,
				designId,
				userId,
				update: {
					generatingFurnitureRecommendation: false
				}
			});

			return {
				error: {
					statusCode: 404,
					message:
						'Could not generate furniture recommendation for the product categories in the design.'
				}
			};
		}

		await ctx.runMutation(internal.v1.design.internal.mutation.updateDesignById, {
			designId: design._id,
			userId,
			update: {
				productIds: ludwigRecommendedProducts.map((product) => product._id)
			}
		});

		if (!design.generateRender)
			await ctx.scheduler.runAfter(0, internal.v1.design.internal.action.generateDesignRender, {
				designId: design._id,
				userId
			});

		await updateDesignStatus({
			ctx,
			designId,
			userId,
			update: {
				generatingFurnitureRecommendation: false
			}
		});

		await ctx.runMutation(internal.v1.workspace.plan.internal.mutation.updateWorkspaceCreditsUsed, {
			workspaceId: design.workspaceId,
			creditsUsed: 200
		});

		const totalPrice = ludwigRecommendedProducts.reduce((acc, product) => {
			return (
				acc +
				(currencyCode === 'USD' ? (product.retailPriceUSD ?? 0) : (product.retailPriceCAD ?? 0))
			);
		}, 0);

		return {
			data: {
				designId,
				totalPrice,
				message:
					ludwigRecommendedResponse?.message || 'Furniture recommendation generated successfully'
			}
		};
	}
});

export const generateDesignRender = internalAction({
	args: {
		designId: v.id('designs'),
		userId: v.id('users')
	},
	handler: async (ctx, { designId, userId }) => {
		await updateDesignStatus({
			ctx,
			designId,
			userId,
			update: {
				renderingImage: true
			}
		});

		const design = await ctx.runQuery(internal.v1.design.internal.query.getDesignById, {
			designId
		});
		if (!design || (design.productIds ?? []).length < 1)
			return await updateDesignStatus({
				ctx,
				designId,
				userId,
				update: {
					renderingImage: false
				}
			});

		const designProducts = await Promise.all(
			design.productIds!.map((productId) =>
				ctx.runQuery(internal.v1.product.internal.query.getProductById, { productId })
			)
		);

		const availableDesignProducts = designProducts.filter((designProduct) => !!designProduct);
		if (availableDesignProducts.length < 1)
			return await updateDesignStatus({
				ctx,
				designId,
				userId,
				update: {
					renderingImage: false
				}
			});

		// const availableDesignProductsWithNoMainImageNoBgUrl = availableDesignProducts.filter(
		// 	(availableDesignProduct) => !availableDesignProduct.mainImageNoBgUrl
		// );

		// if (availableDesignProductsWithNoMainImageNoBgUrl.length > 0) {
		// 	await ctx.runAction(internal.v1.product.internal.sharp.updateProductMainImageNoBgUrls, {
		// 		productsImageMetadata: availableDesignProductsWithNoMainImageNoBgUrl.map(
		// 			(availableDesignProduct) => ({
		// 				productId: availableDesignProduct._id,
		// 				imageUrl: availableDesignProduct.mainImageUrl
		// 			})
		// 		)
		// 	});

		// 	const newAvailableDesignProducts = await Promise.all(
		// 		availableDesignProducts.map((availableDesignProduct) =>
		// 			ctx.runQuery(internal.v1.product.internal.query.getProductById, {
		// 				productId: availableDesignProduct._id
		// 			})
		// 		)
		// 	);

		// 	availableDesignProducts = newAvailableDesignProducts.filter(
		// 		(newAvailableDesignProduct) => !!newAvailableDesignProduct
		// 	);
		// }

		const products = availableDesignProducts.map((designProduct) => ({
			category: designProduct.category,
			url: designProduct.mainImageNoBgUrl ?? designProduct.mainImageUrl,
			name: designProduct.name
		}));

		const productsToSwap = availableDesignProducts
			.filter((designProduct) => design.renderSwappedProductIds?.includes(designProduct._id))
			.map((designProduct) => ({
				category: designProduct.category,
				url: designProduct.mainImageNoBgUrl ?? designProduct.mainImageUrl,
				name: designProduct.name
			}));

		const isSwapRender = productsToSwap.length > 0;

		const { data: renderedImageFiles } = await getDesignRenderedImage({
			spaceType: design.spaceType,
			designName: design.name,
			designDescription: design.description,
			productImages: isSwapRender ? productsToSwap : products,
			originalInspirationImageUrl: design.inspirationImageUrl,
			currentRenderedImageUrl: isSwapRender ? design.renderedImageUrl : undefined
		});
		const renderedImageBase64 = renderedImageFiles?.[0]?.base64;
		if (!renderedImageBase64)
			return await updateDesignStatus({
				ctx,
				designId,
				userId,
				update: {
					renderingImage: false
				}
			});

		const fileName = `rendered-design-${design._id.toString()}`;
		const fileBlob = file.base64ToBlob(renderedImageBase64);

		const { data: uploadData } = await r2.upload({
			bucketName: process.env.R2_USER_RENDERED_DESIGN_IMG_BUCKET_NAME!,
			name: fileName,
			fileNameWithExt: `${fileName}.png`,
			fileBlob,
			bucketUrl: process.env.R2_USER_RENDERED_DESIGN_IMG_BUCKET_URL!
		});

		const renderedImageUrl = uploadData?.url ? `${uploadData.url}?t=${date.now()}` : undefined;

		if (renderedImageUrl)
			await ctx.scheduler.runAfter(0, internal.v1.design.internal.action.generateDesignStyles, {
				workspaceId: design.workspaceId,
				designId,
				renderedImageUrl
			});

		await updateDesignStatus({
			ctx,
			designId,
			userId,
			update: {
				renderingImage: false,
				renderSwappedProductIds: isSwapRender ? [] : design.renderSwappedProductIds,
				renderedImageUrl
			}
		});
	}
});

async function updateDesignStatus({
	ctx,
	designId,
	userId,
	update
}: {
	ctx: ActionCtx;
	designId: Id<'designs'>;
	userId: Id<'users'>;
	update: {
		generatingFurnitureRecommendation?: boolean;
		renderingImage?: boolean;
		renderedImageUrl?: string;
		renderSwappedProductIds?: Id<'products'>[];
		styles?: ProductStyle[];
	};
}) {
	const currentUpdate: UpdateDesign = update;
	if (update.renderedImageUrl) currentUpdate.generateRender = true;

	await ctx.runMutation(internal.v1.design.internal.mutation.updateDesignById, {
		designId: designId,
		userId: userId,
		update: currentUpdate
	});
}

async function getLudwigRecommendedProducts(
	ctx: ActionCtx,
	args: {
		inspirationImageUrl: string;
		spaceType: string;
		productCategories: DesignProductCategory[];
		currencyCode: CurrencyCode;
		designBudget: number;
	}
) {
	const recArgs = {
		image_url: args.inspirationImageUrl,
		room_name: args.spaceType,
		categories: args.productCategories.map((productCategory) => productCategory.category),
		currency: args.currencyCode
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} as any;

	if (args.designBudget > 0) recArgs.priceRange = args.designBudget;

	const { response } = await asyncFetch.post(process.env.LUDWIG_RECOMMENDATION_ENDPOINT!, {
		body: JSON.stringify(recArgs)
	});
	if (!response) return;

	const responseJson = (await response.json()) as LudwigRecommendationResponse;

	const recommendations = responseJson.recommendations?.data;
	if (!recommendations) return;

	const products = await Promise.all(
		recommendations.map((recommendation) =>
			ctx.runQuery(internal.v1.product.internal.query.getProductById, {
				productId: recommendation.id as Id<'products'>
			})
		)
	);

	return {
		products: products.filter((product) => !!product),
		message:
			args.designBudget > 0
				? responseJson.recommendations.status
				: "Furniture recommendation generated successfully'"
	};
}

async function getLudwigRecommendedProductsFallback(
	ctx: ActionCtx,
	args: {
		inspirationImageUrl: string;
		currencyCode: CurrencyCode;
		productCategories: DesignProductCategory[];
	}
): Promise<
	| {
			error: ErrorData;
			data?: undefined;
	  }
	| {
			data: Product[];
			error?: undefined;
	  }
> {
	const { response, error } = await asyncFetch.post(process.env.LUDWIG_VECTOR_GENERATOR_ENDPOINT!, {
		body: JSON.stringify({
			image_url: args.inspirationImageUrl
		})
	});
	if (error) return { error };

	const responseJson = await response.json();
	const inspoVector = responseJson.vector as number[];

	const recommendationResponse = await ctx.runAction(
		internal.v1.product.internal.action.getLudwigProductRecommendationsByCategory,
		{
			currencyCode: args.currencyCode,
			limit: 1,
			categoryList: args.productCategories.map((productCategory) => ({
				imageEmbedding: inspoVector,
				category: productCategory.category
			}))
		}
	);

	const products = await Promise.all(
		recommendationResponse.recommendations
			.filter((recommendation) => recommendation.result.length > 0)
			.map(({ result }) =>
				ctx.runQuery(internal.v1.product.internal.query.getProductById, {
					productId: result[0]._id
				})
			)
	);

	return { data: products.filter((product) => !!product) };
}
