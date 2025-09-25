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
					.describe('The ID of the design to generate furniture recommendations for.')
			})
			.strip(),
		execute: async (input) => {
			const { ctx, userId } = toolCtxParams;

			const { error } = await ctx.runAction(
				internal.v1.design.internal.action.generateDesignFurnitureRecommendation,
				{
					designId: input.designId as Id<'designs'>,
					userId
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
