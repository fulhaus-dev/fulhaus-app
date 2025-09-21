import { generateObject, tool } from 'ai';
import { AiToolCtxParams } from '../../../../type';
import z from 'zod';
import { spaceTypes } from '../../../design/space';
import designProductModel from '../../../design/product/model';
import { internal } from '../../../../_generated/api';
import { ProductCategory, SpaceType } from '../../../design/type';
import { asyncTryCatch } from '../../../../util/async';
import { googleGemini2_5FlashLlm } from '../../../../config/google';

export function getProductCategoriesForDesignTool(toolCtxParams: AiToolCtxParams) {
	return tool({
		description: 'Get product categories for the design',
		inputSchema: z
			.object({
				spaceType: z.enum(spaceTypes).describe('The literal value of the space been designed.')
			})
			.strip(),
		execute: async (input) => {
			const { ctx, chatId } = toolCtxParams;

			const productCategories = designProductModel.getDesignProductCategoriesForSpace(
				input.spaceType
			);

			let spaceProductCategories = productCategories.recommended;

			const ludwigChatTempAsset = await ctx.runQuery(
				internal.v1.ludwig.internal.query.getLudwigChatTempAssetsByChatId,
				{ chatId }
			);

			const floorPlanUrl = ludwigChatTempAsset?.floorPlanUrl;

			if (floorPlanUrl) {
				const { data: spaceProductCategoriesFromFloorPlan } =
					await getSpaceProductCategoriesInFloorPlan({
						spaceType: input.spaceType,
						spaceProductCategories,
						floorPlanUrl
					});

				if (spaceProductCategoriesFromFloorPlan)
					spaceProductCategories = spaceProductCategoriesFromFloorPlan;
			}

			return {
				success: true,
				message: `Product categories for '${input.spaceType}' retrieved successfully`,
				productCategories: spaceProductCategories,
				chatId: toolCtxParams.chatId
			};
		}
	});
}

async function getSpaceProductCategoriesInFloorPlan(args: {
	spaceType: SpaceType;
	spaceProductCategories: ProductCategory[];
	floorPlanUrl: string;
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
			model: googleGemini2_5FlashLlm,
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
							type: 'image',
							image: args.floorPlanUrl
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
