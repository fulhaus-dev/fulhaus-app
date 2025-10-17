import { v } from 'convex/values';
import { internalQuery } from '../../../_generated/server';
import ludwigModel from '../model';
import designModel from '../../design/model';

export const getLudwigChatTempAssetsByChatId = internalQuery({
	args: {
		chatId: v.id('chats')
	},
	handler: async (ctx, args) => {
		return await ludwigModel.getChatTempAssetsByChatId(ctx, args.chatId);
	}
});

export const getLudwigDesignChatContext = internalQuery({
	args: {
		chatId: v.id('chats'),
		floorPlanUrl: v.optional(v.string())
	},
	handler: async (ctx, { chatId, floorPlanUrl }) => {
		const contextParts = [];

		const [currentChatDesign, existingDesignsWithFloorPlanUrl] = await Promise.all([
			designModel.getDesignByChatId(ctx, chatId),
			floorPlanUrl
				? designModel.getExistingDesignsWithFloorPlanUrl(ctx, floorPlanUrl)
				: Promise.resolve([])
		]);

		if (currentChatDesign) {
			contextParts.push(`**Current Design ID:** ${currentChatDesign._id}\n`);
			contextParts.push(`**Current Design Name:** ${currentChatDesign.name}\n`);
			contextParts.push(`**Current Design Description:** ${currentChatDesign.description}\n`);
			contextParts.push(`**Current Design Space Type:** ${currentChatDesign.spaceType}\n`);
			contextParts.push(
				`**Current Design Inspiration Image URL:** ${currentChatDesign.inspirationImageUrl}\n`
			);
			contextParts.push(
				`**Current Design Product Categories:** ${currentChatDesign.productCategories.map((category) => category).join(', ')}\n\n`
			);
		}

		if (existingDesignsWithFloorPlanUrl.length > 0) {
			contextParts.push(`**Existing Designs and spaces using the same Floor Plan:**\n\n`);
			for (const [index, design] of existingDesignsWithFloorPlanUrl.entries()) {
				contextParts.push(`**${index}:**\n`);
				contextParts.push(`**Design Name:** ${design.name}\n`);
				contextParts.push(`**Design Space Type:** ${design.spaceType}\n\n`);
			}
		}

		const ludwigDesignChatContext = contextParts.join('');

		return ludwigDesignChatContext !== '' ? ludwigDesignChatContext : undefined;
	}
});
