import { v } from 'convex/values';
import { ActionCtx, internalAction } from '../../../_generated/server';
import { generateText, ImagePart } from 'ai';
import { asyncTryCatch } from '../../../util/async';
import { googleGemini2_5FlashImagePreviewImm } from '../../../config/google';
import { internal } from '../../../_generated/api';
import { r2 } from '../../../util/r2';
import file from '../../../util/file';
import { Id } from '../../../_generated/dataModel';
import asyncFetch from '../../../util/fetch';
import { LudwigRecommendationResponse } from '../../ludwig/type';
import date from '../../../util/date';

export const generateDesignFurnitureRecommendation = internalAction({
	args: {
		designId: v.id('designs'),
		userId: v.id('users')
	},
	handler: async (ctx, { designId, userId }) => {
		await updateDesignStatus(ctx, designId, userId, {
			generatingFurnitureRecommendation: true
		});
		const design = await ctx.runQuery(internal.v1.design.internal.query.getDesignById, {
			designId
		});
		if (!design) {
			await updateDesignStatus(ctx, designId, userId, {
				generatingFurnitureRecommendation: false
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
			await updateDesignStatus(ctx, designId, userId, {
				generatingFurnitureRecommendation: false
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
			await updateDesignStatus(ctx, designId, userId, {
				generatingFurnitureRecommendation: false
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

		await updateDesignStatus(ctx, designId, userId, {
			generatingFurnitureRecommendation: false
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
		await updateDesignStatus(ctx, designId, userId, {
			renderingImage: true
		});

		const design = await ctx.runQuery(internal.v1.design.internal.query.getDesignById, {
			designId
		});
		if (!design || (design.productIds ?? []).length < 1)
			return await updateDesignStatus(ctx, designId, userId, {
				renderingImage: false
			});

		const designProducts = await Promise.all(
			design.productIds!.map((productId) =>
				ctx.runQuery(internal.v1.product.internal.query.getProductById, { productId })
			)
		);

		const availableDesignProducts = designProducts.filter((designProduct) => !!designProduct);
		if (availableDesignProducts.length < 1)
			return await updateDesignStatus(ctx, designId, userId, {
				renderingImage: false
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
			return await updateDesignStatus(ctx, designId, userId, {
				renderingImage: false
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

		return await updateDesignStatus(ctx, designId, userId, {
			renderingImage: false,
			renderedImageUrl: uploadData?.url ? `${uploadData.url}?t=${date.now()}` : undefined
		});
	}
});

async function updateDesignStatus(
	ctx: ActionCtx,
	designId: Id<'designs'>,
	userId: Id<'users'>,
	update: {
		generatingFurnitureRecommendation?: boolean;
		renderingImage?: boolean;
		renderedImageUrl?: string;
	}
) {
	await ctx.runMutation(internal.v1.design.internal.mutation.updateDesignById, {
		designId: designId,
		userId: userId,
		update
	});
}

async function getDesignRenderedImage(args: {
	designName: string;
	designDescription: string;
	productImages: { category: string; url: string; name: string }[];
	originalInspirationImageUrl: string;
}) {
	const systemPrompt = `
You are an expert interior designer and 3D visualization specialist.

Your task is to generate a photorealistic rendered image of a design space based on:
- The space name and description provided
- The furniture/product images shown

Create a cohesive, aesthetically pleasing room design that incorporates all the provided products in a natural and functional layout taking your design cue from the design name and description.

**IMPORTANT**
The orientation of the generated design image MUST be LANDSCAPE.
`;

	const designProductCategoriesImagePart: ImagePart[] = args.productImages.map((productImage) => ({
		type: 'image',
		image: productImage.url
	}));

	const productList = args.productImages
		.map((productImage, index) => `${index + 1}. ${productImage.category} - ${productImage.name}`)
		.join('\n');

	const { data: result, error } = await asyncTryCatch(() =>
		generateText({
			model: googleGemini2_5FlashImagePreviewImm,
			system: systemPrompt,
			messages: [
				{
					role: 'user',
					content: [
						{
							type: 'text',
							text: `Generate a rendered image for this design:
              
              **Design Name**: ${args.designName}
              
              **Design Description**:${args.designDescription}
              
              **The ${args.productImages.length} Products to include (images attached below):**
              ${productList}

              The last image is the original inspiration image, should not be part of the design but should be used to guide the space aesthetics, like wall, floor etc.
              
              Please create a design based on the design name and description that naturally incorporates all these furniture pieces.`
						},
						...designProductCategoriesImagePart,
						{
							type: 'text',
							text: 'This image is the original inspiration image, should not be part of the design but should be used to guide the space aesthetics, like wall, floor etc.'
						},
						{
							type: 'image',
							image: args.originalInspirationImageUrl
						}
					]
				}
			]
		})
	);

	if (error)
		return {
			error
		};

	return {
		data: result.files
	};
}
