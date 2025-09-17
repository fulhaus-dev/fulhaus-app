import { tool } from 'ai';
import z from 'zod';
import { AiToolCtxParams } from '../../../../type';

export function generateDesignFurnitureRecommendationTool(toolCtxParams: AiToolCtxParams) {
	return tool({
		description: 'Generate furniture recommendations for a design',
		inputSchema: z
			.object({
				designId: z
					.string()
					.describe('The ID of the design to generate furniture recommendations for.')
			})
			.strip(),
		execute: async (input) => {
			/**
			 * Handle external ludwig call to get product ids
			 */

			// const { ctx, userId, workspaceId, chatId } = toolCtxParams;
			// const { projectId, ...otherInput } = input;

			// const designId = await ctx.runMutation(internal.v1.design.internal.mutation.createDesign, {
			// 	userId,
			// 	create: {
			// 		...otherInput,
			// 		projectId: projectId as Id<'projects'>,
			// 		workspaceId,
			// 		chatId
			// 	}
			// });

			return {
				success: true,
				message: 'Design furniture recommendations generated successfully',
				designId: input.designId,
				chatId: toolCtxParams.chatId
			};
		}
	});
}
