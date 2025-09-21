import { tool } from 'ai';
import z from 'zod';
import { AiToolCtxParams } from '../../../../type';
import { internal } from '../../../../_generated/api';
import { Id } from '../../../../_generated/dataModel';
import asyncFetch from '../../../../util/fetch';
import { LudwigRecommendationResponse } from '../../type';

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
			const { ctx, workspaceId, chatId } = toolCtxParams;

			const design = await ctx.runQuery(internal.v1.design.internal.query.getDesignById, {
				designId: input.designId as Id<'designs'>
			});
			if (!design)
				return {
					success: false,
					error: 'The design with this ID was not found, did you forget to create the design first?'
				};

			const { response, error } = await asyncFetch.post(
				process.env.LUDWIG_RECOMMENDATION_ENDPOINT!,
				{
					body: JSON.stringify({
						image_url: design.inspirationImageUrl,
						room_name: design.spaceType,
						categories: design.productCategories
					})
				}
			);
			if (error)
				return {
					success: false,
					error: 'Something went wrong while generating furniture recommendations',
					message: error.message
				};

			const responseJson = (await response.json()) as LudwigRecommendationResponse;

			const recommendations = responseJson.recommendations.data;

			await Promise.all(
				recommendations.map((recommendation) =>
					ctx.runMutation(internal.v1.design.product.internal.mutation.createDesignProduct, {
						create: {
							workspaceId,
							projectId: design.projectId,
							chatId,
							designId: design._id,
							productId: recommendation.id,
							name: recommendation.name,
							imageUrl: recommendation.url,
							category: recommendation.category
						}
					})
				)
			);

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
