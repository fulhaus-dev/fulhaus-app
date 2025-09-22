import { v } from 'convex/values';
import { ActionCtx, internalAction } from '../../../_generated/server';
import { generateText, ImagePart } from 'ai';
import { asyncTryCatch } from '../../../util/async';
import { googleGemini2_5FlashImagePreviewImm } from '../../../config/google';
import { internal } from '../../../_generated/api';
import { r2 } from '../../../util/r2';
import file from '../../../util/file';
import { Id } from '../../../_generated/dataModel';

export const generateDesignRender = internalAction({
	args: {
		chatId: v.id('chats')
	},

	handler: async (ctx, { chatId }) => {
		const designProductData = await ctx.runQuery(
			internal.v1.design.product.internal.query.getDesignProductsByChatId,
			{ chatId }
		);

		const design = designProductData.design;
		const designProducts = designProductData.designProducts;
		if (!design || designProducts.length < 1) return;

		await updateDesignStatus(ctx, design._id, design.createdById, {
			renderingImage: true
		});

		const { data: renderedImageFiles } = await getDesignRenderedImage({
			designName: design.name,
			designDescription: design.description,
			productImages: designProducts.map((designProduct) => ({
				category: designProduct.category,
				url: designProduct.imageUrl,
				name: designProduct.name
			})),
			originalInspirationImageUrl: design.inspirationImageUrl
		});

		const renderedImageBase64 = renderedImageFiles?.[0]?.base64;

		if (renderedImageBase64) {
			const fileName = `rendered-design-${design._id.toString()}`;
			const fileBlob = file.base64ToBlob(renderedImageBase64);

			const { data: uploadData } = await r2.upload({
				bucketName: process.env.R2_USER_RENDERED_DESIGN_IMG_BUCKET_NAME!,
				name: fileName,
				fileNameWithExt: `${fileName}.png`,
				fileBlob,
				bucketUrl: process.env.R2_USER_RENDERED_DESIGN_IMG_BUCKET_URL!
			});

			if (uploadData) {
				await updateDesignStatus(ctx, design._id, design.createdById, {
					renderingImage: false,
					renderedImageUrl: uploadData.url
				});
				return;
			}
		}

		await updateDesignStatus(ctx, design._id, design.createdById, {
			renderingImage: false
		});
	}
});

async function updateDesignStatus(
	ctx: ActionCtx,
	designId: Id<'designs'>,
	userId: Id<'users'>,
	update: { renderingImage?: boolean; renderedImageUrl?: string }
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

The orientation of the image MUST be Landscape.

Create a cohesive, aesthetically pleasing room design that incorporates all the provided products in a natural and functional layout taking your design cue from the design name and description.
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
