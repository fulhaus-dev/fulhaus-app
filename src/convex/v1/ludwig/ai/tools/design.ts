import { tool } from 'ai';
import z from 'zod';
import { internal } from '../../../../_generated/api';
import { Id } from '../../../../_generated/dataModel';
import { productCategories, spaceTypes } from '../../../../constant';
import { AiToolCtxParams } from '../../../../type';

export function createDesignTool(toolCtxParams: AiToolCtxParams) {
	return tool({
		description: 'Create design',
		inputSchema: z
			.object({
				projectId: z.string().describe('The ID of the current project.'),
				name: z.string().describe('A descriptive name for the design based on space type.'),
				description: z.string().describe('A short, one-sentence description of the design.'),
				spaceType: z
					.enum(spaceTypes)
					.describe(
						'An literal value of the space type, that best represents the general classification of the space to be designed.'
					),
				inspirationImageUrl: z.url().describe('A URL of the inspiration image for the design.'),
				productCategories: z
					.array(z.enum(productCategories))
					.describe(
						'An array of literal furniture product categories for the space type to be designed.'
					)
			})
			.strip(),
		execute: async (input) => {
			const { ctx, userId, workspaceId, chatId } = toolCtxParams;
			const { projectId, ...otherInput } = input;

			const newDesignId = await ctx.runMutation(internal.v1.design.internal.mutation.createDesign, {
				userId,
				create: {
					...otherInput,
					projectId: projectId as Id<'projects'>,
					workspaceId,
					chatId
				}
			});

			await ctx.runMutation(internal.v1.chat.internal.mutation.updateChatById, {
				chatId,
				designId: newDesignId
			});

			return {
				designId: newDesignId,
				message: 'Design created successfully'
			};
		}
	});
}

export function updateDesignTool(toolCtxParams: AiToolCtxParams) {
	return tool({
		description: 'Update design',
		inputSchema: z
			.object({
				designId: z.string().describe('The ID of the design to update.'),
				update: z
					.object({
						name: z.string().optional().describe('The new name for the design.'),
						description: z
							.string()
							.describe('The new short, one sentence description for the design.'),
						spaceType: z
							.enum(spaceTypes)
							.describe(
								'New literal value of the space type, that best represents the general classification of the space to be designed.'
							),
						inspirationImageUrl: z.url().describe('New URL of the inspiration image.'),
						productCategories: z
							.array(z.enum(productCategories))
							.describe(
								'New array of literal furniture product categories for the space type to be designed.'
							)
					})
					.strip()
			})
			.strip(),
		execute: async (input) => {
			const { ctx, userId } = toolCtxParams;
			const { designId, update } = input;

			await ctx.runMutation(internal.v1.design.internal.mutation.updateDesignById, {
				userId,
				designId: designId as Id<'designs'>,
				update
			});

			return {
				designId,
				message: 'Design updated successfully'
			};
		}
	});
}
