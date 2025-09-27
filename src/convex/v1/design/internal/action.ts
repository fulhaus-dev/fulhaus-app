import { v } from 'convex/values';
import { ActionCtx, internalAction } from '../../../_generated/server';
import { internal } from '../../../_generated/api';
import { r2 } from '../../../util/r2';
import file from '../../../util/file';
import { Id } from '../../../_generated/dataModel';
import asyncFetch from '../../../util/fetch';
import { LudwigRecommendationResponse } from '../../ludwig/type';
import date from '../../../util/date';
import { getDesignRenderedImage, getDesignStylesFromRenderedImage } from '../../ludwig/ai/util';
import { ProductStyle } from '../../product/type';

export const generateDesignStyles = internalAction({
	args: {
		designId: v.id('designs'),
		userId: v.id('users'),
		renderedImageUrl: v.string()
	},
	handler: async (ctx, { designId, userId, renderedImageUrl }) => {
		const { data: designStyles } = await getDesignStylesFromRenderedImage(renderedImageUrl);
		if (!designStyles) return;

		return await updateDesignStatus({
			ctx,
			designId,
			userId,
			update: {
				styles: designStyles
			}
		});
	}
});

export const generateDesignFurnitureRecommendation = internalAction({
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

		const { response, error } = await asyncFetch.post(process.env.LUDWIG_RECOMMENDATION_ENDPOINT!, {
			body: JSON.stringify({
				image_url: design.inspirationImageUrl,
				room_name: design.spaceType,
				categories: design.productCategories
			})
		});
		if (error) {
			await updateDesignStatus({
				ctx,
				designId,
				userId,
				update: {
					generatingFurnitureRecommendation: false
				}
			});

			return { error };
		}

		const responseJson = (await response.json()) as LudwigRecommendationResponse;

		const recommendations = responseJson.recommendations.data;

		const products = await Promise.all(
			recommendations.map((recommendation) =>
				ctx.runQuery(internal.v1.product.internal.query.getProductByLudwigImageUrl, {
					ludwigImageUrl: recommendation.url
				})
			)
		);

		const availableProducts = products.filter((product) => !!product);
		if (!availableProducts) {
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
				productIds: availableProducts.map((product) => product._id)
			}
		});

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

		return { data: designId };
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

		const { data: renderedImageFiles } = await getDesignRenderedImage({
			designName: design.name,
			designDescription: design.description,
			productImages: availableDesignProducts.map((designProduct) => ({
				category: designProduct.category,
				url: designProduct.mainImageUrl ?? designProduct.ludwigImageUrl,
				name: designProduct.name
			})),
			originalInspirationImageUrl: design.inspirationImageUrl
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
				designId,
				userId,
				renderedImageUrl
			});

		return await updateDesignStatus({
			ctx,
			designId,
			userId,
			update: {
				renderingImage: false,
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
		styles?: ProductStyle[];
	};
}) {
	await ctx.runMutation(internal.v1.design.internal.mutation.updateDesignById, {
		designId: designId,
		userId: userId,
		update
	});
}
