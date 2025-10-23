import { tool } from 'ai';
import z from 'zod';
import { AiToolCtxParams } from '../../../../type';
import { internal } from '../../../../_generated/api';
import { Id } from '../../../../_generated/dataModel';

export function generateDesignFurnitureRecommendationTool(toolCtxParams: AiToolCtxParams) {
	return tool({
		description: 'Generates furniture recommendations for a design',
		inputSchema: z
			.object({
				designId: z
					.string()
					.describe('The ID of the design to generate furniture recommendations for.'),
				designBudget: z
					.optional(z.number().default(0))
					.describe('The budget for the design in if any.')
			})
			.strip(),
		execute: async (input) => {
			const { ctx, userId, currencyCode } = toolCtxParams;

			const { error } = await ctx.runAction(
				internal.v1.design.internal.action.generateDesignFurnitureRecommendation,
				{
					currencyCode,
					designId: input.designId as Id<'designs'>,
					userId,
					designBudget: input.designBudget
				}
			);
			if (error)
				return {
					success: false,
					error: error.message
				};

			return {
				success: true,
				message: 'Design furniture recommendations generated successfully',
				designId: input.designId,
				chatId: toolCtxParams.chatId,
				toolName: 'generateDesignFurnitureRecommendation'
			};
		}
	});
}
