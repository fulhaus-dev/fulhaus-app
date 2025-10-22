import z from 'zod';
import { FloorPlanFile } from '../../../type';
import { SpaceType } from '../../design/type';
import { ProductCategory } from '../../product/type';
import { asyncTryCatch } from '../../../util/async';
import { generateObject, generateText } from 'ai';
import {
	googleGenerativeAIGemini2_5FlashImagePreview,
	googleGenerativeAIGemini2_5Flash
} from '../../../config/google';
import { productStyles } from '../../product/constant';

export async function getSpaceProductCategoriesInFloorPlan(args: {
	spaceType: SpaceType;
	spaceProductCategories: ProductCategory[];
	floorPlanFile: FloorPlanFile;
}) {
	const outputSchema = z.object({
		productCategoriesInSpace: z
			.array(z.string())
			.nullable()
			.describe(`The list of product categories for the target space in the floor plan if any.`)
	});

	const systemPrompt = `
You are an expert in analyzing a target space in a floor plan and finding only the items that match the provided product categories in a target space for interior design, within the provided floor plan without duplication or adding any other type of items. 

Your SOLE task is to analyze the target space in the provided floor plan and return only the equivalent product categories from the provided Product Category List, without duplication or adding any other type of items.. 

Product Category List: 
${args.spaceProductCategories.join('\n')}
`;

	const { data, error } = await asyncTryCatch(() =>
		generateObject({
			model: googleGenerativeAIGemini2_5Flash,
			system: systemPrompt,
			schema: outputSchema,
			messages: [
				{
					role: 'user',
					content: [
						{
							type: 'text',
							text: `Provide the list of product categories for this target space - "${args.spaceType}" in the attached floor plan.`
						},
						{
							type: 'file',
							data: args.floorPlanFile.url,
							mediaType: args.floorPlanFile.mediaType
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
		data: data.object.productCategoriesInSpace as ProductCategory[]
	};
}

export async function getDesignStylesFromRenderedImage(renderedImageUrl: string) {
	const outputSchema = z.object({
		styles: z
			.array(z.enum(productStyles))
			.describe(`The list of design styles matching the interior/exterior space design image.`)
	});

	const systemPrompt = `
You are an expert in analyzing an interior/exterior space design image and finding only the matching styles based on the provided image. 

Your SOLE task is to analyze the image and return only the matching styles from the Style List. 

Style List: 
${productStyles.join('\n')}
`;

	const { data, error } = await asyncTryCatch(() =>
		generateObject({
			model: googleGenerativeAIGemini2_5Flash,
			system: systemPrompt,
			schema: outputSchema,
			messages: [
				{
					role: 'user',
					content: [
						{
							type: 'text',
							text: `Provide the styles in the attached interior/exterior space design image.`
						},
						{
							type: 'image',
							image: renderedImageUrl
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
		data: data.object.styles
	};
}

// You will be provided with the following information:
// - The design name and description.
// - Space type.
// - The list of product images.

// You will be provided with the following information:
// - The design name and description.
// - The list of product images
// - The users inspiration image

// **Guidelines:**
// - Use the provided space type and design name and description as guide to inform your visualization decisions.
// - Any items in the provided inspiration image should not be part of the final visualization, only use it to guide your decision on style, colors, mood and layout.

// **Guidelines:**
// - Use the provided space type and design name and description as guide to inform your visualization decisions.
// - Use the exact product list of product images in the generated design visualization for the space.

//   **Space Type**: ${args.spaceType}
//   **Design Name**: ${args.designName}
//   **Design Description**:${args.designDescription}

//   **The ${args.productImages.length} Products to include (images attached):**
//   ${productList}

//   The last image is the inspiration image, items in this image should not be part of the design but should be used to guide the space aesthetics, layout, style, color, wall, floor etc.`

export async function getDesignRenderedImage(args: {
	designName: string;
	spaceType: SpaceType;
	designDescription: string;
	productImages: { category: string; url: string; name: string }[];
	originalInspirationImageUrl: string;
}) {
	const systemPrompt = `
You are an expert interior/exterior space design visualization expert for this design:

**Space Type**: ${args.spaceType}
**Design Name**: ${args.designName}
**Design Description**:${args.designDescription}

Your task is to generate a photorealistic visualization of a ${args.spaceType} space based on the provided product images. All product images must appear in the visualization. Do not replace the provided product images with a different product image, however you can add other items to complement the space as long as the provided product images are in the visualization.
`;

	// const designProductCategoriesImagePart: ImagePart[] = args.productImages.map((productImage) => ({
	// 	type: 'image',
	// 	image: productImage.url
	// }));

	const designProductCategoriesImagePart = args.productImages.flatMap((product) => [
		{
			type: 'text' as const,
			text: `Category: ${product.category}`
		},
		{
			type: 'image' as const,
			image: new URL(product.url)
			// providerOptions is available but Google doesn't use it for metadata
		}
	]);

	// const productList = args.productImages
	// 	.map((productImage, index) => `${index + 1}. ${productImage.category} - ${productImage.name}`)
	// 	.join('\n');

	const { data: result, error } = await asyncTryCatch(() =>
		generateText({
			model: googleGenerativeAIGemini2_5FlashImagePreview,
			system: systemPrompt,
			messages: [
				{
					role: 'user',
					content: [
						// 			{
						// 				type: 'text',
						// 				text: `Create a cohesive, aesthetically pleasing space design that incorporates all the provided product images in a natural and functional layout:

						//   **Space Type**: ${args.spaceType}
						//   **Design Name**: ${args.designName}
						//   **Design Description**:${args.designDescription}

						//   **The ${args.productImages.length} Products to include (images attached):**
						//   ${productList}`
						// 			},
						...designProductCategoriesImagePart,
						{
							type: 'text',
							text: 'This image is the inspiration image. It should be used to guide your decision on space layout only.'
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
