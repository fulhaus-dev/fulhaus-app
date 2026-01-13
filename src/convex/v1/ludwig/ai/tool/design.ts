import { tool } from 'ai';
import z from 'zod';
import { internal } from '../../../../_generated/api';
import { Id } from '../../../../_generated/dataModel';
import { AiToolCtxParams } from '../../../../type';
import { spaceTypes } from '../../../design/constant';
import { productCategories, productStyles } from '../../../product/constant';

export function createDesignTool(toolCtxParams: AiToolCtxParams) {
	return tool({
		description: 'Creates a design',
		inputSchema: z
			.object({
				name: z.string().describe('A descriptive name for the design based on space type.'),
				description: z.string().describe('A detailed description of the design.'),
				spaceType: z
					.enum(spaceTypes)
					.describe(
						'The space type to design, that best represents the general classification of the space to be designed.'
					),
				inspirationImageUrl: z.url().describe('The inspiration image url provided by the user.'),
				floorPlanUrl: z
					.optional(z.url())
					.describe('The floor plan url provided by the user. If any'),
				spaceImageUrl: z
					.optional(z.url())
					.describe('The image url of the space to be designed provided by the user. If any'),
				productCategories: z
					.array(z.object({ category: z.enum(productCategories) }))
					.describe('The array of furniture product categories for the space to be designed.'),
				styles: z
					.array(z.enum(productStyles))
					.describe('The array of matching styles based on the inspiration image.')
			})
			.strip(),
		execute: async (input) => {
			const { ctx, userId, workspaceId, chatId, currencyCode } = toolCtxParams;
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { floorPlanUrl, spaceImageUrl: providedSpaceImageUrl, styles, ...otherInput } = input;

			const ludwigChatTempAsset = await ctx.runQuery(
				internal.v1.ludwig.internal.query.getLudwigChatTempAssetsByChatId,
				{ chatId }
			);

			const inspirationImageUrl = ludwigChatTempAsset?.inspoImageUrl;
			const floorPlanFile = ludwigChatTempAsset?.floorPlanFile;
			const spaceImageUrl = ludwigChatTempAsset?.spaceImageUrl;

			if (!inspirationImageUrl)
				return {
					success: false,
					error:
						'Inspiration image url was not provided by the user. Did you forget to request for the inspiration image by calling the appropriate UI tool?'
				};

			if (floorPlanUrl && !floorPlanFile)
				return {
					success: false,
					error:
						'Floor plan url was not provided by the user. Did you forget to request for the floor plan by calling the appropriate UI tool?'
				};

			if (providedSpaceImageUrl && !spaceImageUrl)
				return {
					success: false,
					error:
						'The space image url was not provided by the user appears to be invalid. Does the user have a space image? Did you forget to request for the space image (if the user has a space image) by calling the appropriate UI tool? If the user does not have a space image, do not pass a value for spaceImageUrl.'
				};

			const newDesignId = await ctx.runMutation(
				internal.v1.ludwig.ai.tool.internal.mutation.aiCreateDesign,
				{
					workspaceId,
					userId,
					create: {
						...otherInput,
						workspaceId,
						chatId,
						inspirationImageUrl,
						floorPlanFile,
						spaceImageUrl,
						currencyCode
					},
					styles
				}
			);

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
				designId: newDesignId,
				instruction: 'Design created successfully. Please proceed to the next step.'
			};
		}
	});
}

export function updateDesignTool(toolCtxParams: AiToolCtxParams) {
	return tool({
		description: 'Updates a design',
		inputSchema: z
			.object({
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
								'The new space type to design, that best represents the general classification of the space to be designed.'
							),
						inspirationImageUrl: z
							.optional(z.url())
							.describe('The new inspiration image url provided by the user.'),
						floorPlanUrl: z
							.optional(z.url())
							.describe('The new floor plan url provided by the user.'),
						spaceImageUrl: z
							.optional(z.url())
							.describe('The new image url of the space to be designed provided by the user.'),
						productCategories: z
							.optional(z.array(z.object({ category: z.enum(productCategories) })))
							.describe('New array of furniture product categories for the space to be designed.'),
						styles: z
							.array(z.enum(productStyles))
							.describe('New array of matching styles based on the inspiration image.')
					})
					.strip()
			})
			.strip(),
		execute: async (input) => {
			const { ctx, userId, chatId, workspaceId } = toolCtxParams;
			const { designId, update } = input;
			const {
				floorPlanUrl,
				inspirationImageUrl: providedInspirationImageUrl,
				spaceImageUrl: providedSpaceImageUrl,
				styles,
				...otherDesignDataToUpdate
			} = update;

			const ludwigChatTempAsset = await ctx.runQuery(
				internal.v1.ludwig.internal.query.getLudwigChatTempAssetsByChatId,
				{ chatId }
			);

			const inspirationImageUrl = ludwigChatTempAsset?.inspoImageUrl;
			const floorPlanFile = ludwigChatTempAsset?.floorPlanFile;
			const spaceImageUrl = ludwigChatTempAsset?.spaceImageUrl;

			if (providedInspirationImageUrl && !inspirationImageUrl)
				return {
					success: false,
					error:
						'Inspiration image url was not provided by the user. Did you forget to request for the inspiration image by calling the appropriate UI tool?'
				};

			if (floorPlanUrl && !floorPlanFile)
				return {
					success: false,
					error:
						'Floor plan url was not provided by the user. Did you forget to request for the floor plan by calling the appropriate UI tool?'
				};

			if (providedSpaceImageUrl && !spaceImageUrl)
				return {
					success: false,
					error:
						'The space image url was not provided by the user appears to be invalid. Does the user have a space image? Did you forget to request for the space image (if the user has a space image) by calling the appropriate UI tool? If the user does not have a space image, do not pass a value for spaceImageUrl.'
				};

			await ctx.runMutation(internal.v1.ludwig.ai.tool.internal.mutation.aiUpdateDesignById, {
				workspaceId,
				userId,
				designId: designId as Id<'designs'>,
				update: {
					...otherDesignDataToUpdate,
					inspirationImageUrl,
					floorPlanFile,
					spaceImageUrl
				},
				styles
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
				designId,
				instruction: 'Design updated successfully. Please proceed to the next step.'
			};
		}
	});
}

export function redirectToStartNewDesignChatTool(toolCtxParams: AiToolCtxParams) {
	return tool({
		description: 'Redirects the user to start a new design chat.',
		inputSchema: z.object({
			spaceToDesign: z.enum(spaceTypes).describe('The new space to design.')
		}),
		execute: async ({ spaceToDesign }) => {
			const { ctx, workspaceId, userId } = toolCtxParams;

			const chatId = await ctx.runMutation(internal.v1.chat.internal.mutation.createChat, {
				userId,
				workspaceId
			});

			return {
				success: true,
				message: 'User redirected to start a new design successfully',
				chatId,
				spaceToDesign,
				toolName: 'redirectToStartNewDesignChat'
			};
		}
	});
}
