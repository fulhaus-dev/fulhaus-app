import { tool } from 'ai';
import { AiToolCtxParams } from '../../../../type';
import { spaceTypeProductCategories, spaceTypes } from '../../../design/constant';
import { internal } from '../../../../_generated/api';
import z from 'zod';
import { getSpaceProductCategoriesInFloorPlan } from '../util';

export function getProductCategoriesForDesignTool(toolCtxParams: AiToolCtxParams) {
	return tool({
		description: 'Provides the product categories for the space to design',
		inputSchema: z
			.object({
				spaceType: z.enum(spaceTypes).describe('The space type to been designed.')
			})
			.strip(),
		execute: async (input) => {
			const { ctx, chatId } = toolCtxParams;

			const productCategories = spaceTypeProductCategories[input.spaceType];

			let spaceProductCategories = productCategories.recommended;

			const ludwigChatTempAsset = await ctx.runQuery(
				internal.v1.ludwig.internal.query.getLudwigChatTempAssetsByChatId,
				{ chatId }
			);

			const floorPlanFile = ludwigChatTempAsset?.floorPlanFile;

			if (floorPlanFile) {
				const { data: spaceProductCategoriesFromFloorPlan } =
					await getSpaceProductCategoriesInFloorPlan({
						spaceType: input.spaceType,
						spaceProductCategories,
						floorPlanFile
					});

				if (spaceProductCategoriesFromFloorPlan)
					spaceProductCategories = spaceProductCategoriesFromFloorPlan;
			}

			return {
				productCategories: spaceProductCategories,
				instruction: 'Product categories retrieved successfully. Please proceed to the next step.'
			};
		}
	});
}
