import { tool } from 'ai';
import z from 'zod';
import { internal } from '../../../../_generated/api';
import { Id } from '../../../../_generated/dataModel';

import { AiToolCtxParams } from '../../../../type';
import { spaceTypes } from '../../../design/space';
import { productCategories } from '../../../design/product/category';

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
				inspirationImageUrl: z
					.url()
					.describe('The exact inspiration image url provided by the user.'),
				floorPlanUrl: z
					.optional(z.url())
					.describe('The exact floor plan url provided by the user. If any'),
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

			const ludwigChatTempAsset = await ctx.runQuery(
				internal.v1.ludwig.internal.query.getLudwigChatTempAssetsByChatId,
				{ chatId }
			);

			const inspirationImageUrl = ludwigChatTempAsset?.inspoImageUrl;
			const floorPlanUrl = ludwigChatTempAsset?.floorPlanUrl;

			if (!inspirationImageUrl)
				return {
					success: false,
					error:
						'Inspiration image url was not provided by the user. Did you forget to request for the inspiration image by calling the appropriate UI tool?'
				};

			if (input.floorPlanUrl && !floorPlanUrl)
				return {
					success: false,
					error:
						'Floor plan url was not provided by the user. Did you forget to request for the floor plan by calling the appropriate UI tool?'
				};

			if (floorPlanUrl)
				await ctx.runMutation(internal.v1.project.internal.mutation.updateProjectFloorPlans, {
					projectId: projectId as Id<'projects'>,
					userId,
					newFloorPlanUrls: [floorPlanUrl]
				});

			const newDesignId = await ctx.runMutation(internal.v1.design.internal.mutation.createDesign, {
				userId,
				create: {
					...otherInput,
					projectId: projectId as Id<'projects'>,
					workspaceId,
					chatId,
					inspirationImageUrl,
					floorPlanUrl
				}
			});

			await ctx.runMutation(internal.v1.chat.internal.mutation.updateChatById, {
				chatId,
				designId: newDesignId
			});

			await ctx.runMutation(
				internal.v1.ludwig.internal.mutation.deleteLudwigChatTempAssetsByChatId,
				{
					chatId
				}
			);

			return {
				success: true,
				message: 'Design created successfully',
				designId: newDesignId
			};
		}
	});
}

export function updateDesignTool(toolCtxParams: AiToolCtxParams) {
	return tool({
		description: 'Update design',
		inputSchema: z
			.object({
				projectId: z.string().describe('The ID of the current project.'),
				designId: z.string().describe('The ID of the design to update.'),
				update: z
					.object({
						name: z.optional(z.string()).describe('The new name for the design.'),
						description: z
							.optional(z.string())
							.describe('The new short, one sentence description for the design.'),
						spaceType: z
							.optional(z.enum(spaceTypes))

							.describe(
								'New literal value of the space type, that best represents the general classification of the space to be designed.'
							),
						inspirationImageUrl: z
							.optional(z.url())
							.describe('The new exact inspiration image url provided by the user.'),
						floorPlanUrl: z
							.optional(z.url())
							.describe('The new exact floor plan url provided by the user.'),
						productCategories: z
							.optional(z.array(z.enum(productCategories)))
							.describe(
								'New array of literal furniture product categories for the space type to be designed.'
							)
					})
					.strip()
			})
			.strip(),
		execute: async (input) => {
			const { ctx, userId, chatId } = toolCtxParams;
			const { designId, update } = input;

			const ludwigChatTempAsset = await ctx.runQuery(
				internal.v1.ludwig.internal.query.getLudwigChatTempAssetsByChatId,
				{ chatId }
			);

			const inspirationImageUrl = ludwigChatTempAsset?.inspoImageUrl;
			const floorPlanUrl = ludwigChatTempAsset?.floorPlanUrl;

			if (update.inspirationImageUrl && !inspirationImageUrl)
				return {
					success: false,
					error:
						'Inspiration image url was not provided by the user. Did you forget to request for the inspiration image by calling the appropriate UI tool?'
				};

			if (update.floorPlanUrl && !floorPlanUrl)
				return {
					success: false,
					error:
						'Floor plan url was not provided by the user. Did you forget to request for the floor plan by calling the appropriate UI tool?'
				};

			if (update.inspirationImageUrl) update.inspirationImageUrl = inspirationImageUrl;
			if (update.floorPlanUrl) {
				update.floorPlanUrl = floorPlanUrl;

				await ctx.runMutation(internal.v1.project.internal.mutation.updateProjectFloorPlans, {
					projectId: input.projectId as Id<'projects'>,
					userId,
					newFloorPlanUrls: [floorPlanUrl!]
				});
			}

			await ctx.runMutation(internal.v1.design.internal.mutation.updateDesignById, {
				userId,
				designId: designId as Id<'designs'>,
				update
			});

			await ctx.runMutation(
				internal.v1.ludwig.internal.mutation.deleteLudwigChatTempAssetsByChatId,
				{
					chatId
				}
			);

			return {
				success: true,
				message: 'Design updated successfully',
				designId
			};
		}
	});
}

export function redirectToStartNewDesignInSameProjectTool(toolCtxParams: AiToolCtxParams) {
	return tool({
		description: 'Redirects the user to start a new design within the same project.',
		inputSchema: z.object({
			spaceToDesign: z.enum(spaceTypes).describe('The space to design.')
		}),
		execute: async ({ spaceToDesign }) => {
			const { ctx, workspaceId, userId } = toolCtxParams;

			const chatId = await ctx.runMutation(internal.v1.ludwig.internal.mutation.createChat, {
				userId,
				workspaceId
			});

			return {
				success: true,
				message: 'User redirected to start a new design successfully',
				chatId,
				spaceToDesign,
				toolName: 'redirectToStartNewDesignInSameProject'
			};
		}
	});
}
