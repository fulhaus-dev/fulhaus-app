import { tool } from 'ai';
import { AiToolCtxParams } from '../../../../type';
import z from 'zod';
import { spaceTypes } from '../../../../constant';
import { spaceTypeProductCategories } from '../constant';

export function getProductCategoriesForDesignTool(toolCtxParams: AiToolCtxParams) {
	return tool({
		description: 'Generate furniture recommendations for a design',
		inputSchema: z
			.object({
				spaceType: z.enum(spaceTypes).describe('An literal value of the space been designed.')
			})
			.strip(),
		execute: async (input) => {
			const productCategories = spaceTypeProductCategories[input.spaceType];

			return {
				success: true,
				message: `Product categories for '${input.spaceType}' retrieved successfully`,
				...productCategories,
				chatId: toolCtxParams.chatId
			};
		}
	});
}
