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

			const { data, error } = await ctx.runAction(
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

			const currentDesignBudget = input.designBudget ?? 0;

			if (currentDesignBudget > 0 && data.totalPrice > currentDesignBudget)
				return {
					success: false,
					error: `The least possible recommendation budget for the total items in the design is ${data.totalPrice}. You might want to review your budget.`
				};

			return {
				success: true,
				message: data.message,
				designId: input.designId,
				chatId: toolCtxParams.chatId,
				toolName: 'generateDesignFurnitureRecommendation'
			};
		}
	});
}
