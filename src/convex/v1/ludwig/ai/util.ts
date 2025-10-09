import z from 'zod';
import { FloorPlanFile } from '../../../type';
import { SpaceType } from '../../design/type';
import { ProductCategory } from '../../product/type';
import { asyncTryCatch } from '../../../util/async';
import { generateObject, generateText, ImagePart } from 'ai';
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

export async function getDesignRenderedImage(args: {
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
			model: googleGenerativeAIGemini2_5FlashImagePreview,
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
