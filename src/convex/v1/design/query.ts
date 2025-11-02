import { v } from 'convex/values';
import { query } from '../../_generated/server';
import authorization from '../../middleware/authorization';
import designModel from './model';
import { SuccessData } from '../../response/success';
import { vCurrencyCode } from '../../validator';
import designTagModel from './tag/model';

export const getDesignDataByChatId = query({
	args: {
		chatId: v.id('chats'),
		currencyCode: vCurrencyCode
	},
	handler: async (ctx, args) => {
		await authorization.userIsAuthenticated(ctx);

		const [design, designProducts] = await Promise.all([
			designModel.getDesignByChatId(ctx, args.chatId),
			designModel.getDesignProductsByChatId(ctx, args.chatId, args.currencyCode)
		]);

		const designTags = design?._id
			? await designTagModel.getDesignTagsByDesignId(ctx, design?._id)
			: [];

		return SuccessData({ design, designProducts, designTags });
	}
});

export const getDesignsByWorkspaceId = query({
	args: {
		workspaceId: v.id('workspaces')
	},
	handler: async (ctx, args) => {
		await authorization.userIsAuthenticated(ctx);

		const designs = await designModel.getDesignsByWorkspaceId(ctx, args.workspaceId);

		const designsWithTags = await Promise.all(
			designs.map(async (design) => ({
				design,
				designTags: await designTagModel.getDesignTagsByDesignId(ctx, design._id)
			}))
		);

		return SuccessData({ designsWithTags });
	}
});

export const getUniqueDesignSpacesForWorkspace = query({
	args: {
		workspaceId: v.id('workspaces')
	},
	handler: async (ctx, args) => {
		await authorization.userIsAuthenticated(ctx);

		const spaces = await designModel.getUniqueDesignSpacesForWorkspace(ctx, args.workspaceId);

		return SuccessData({ spaces });
	}
});

export const getSharedDesign = query({
	args: {
		designId: v.id('designs'),
		currencyCode: vCurrencyCode
	},
	handler: async (ctx, args) => {
		const [design, designProducts] = await Promise.all([
			designModel.getDesignById(ctx, args.designId),
			designModel.getDesignProducts(ctx, args.designId, args.currencyCode)
		]);

		const designTags = design?._id
			? await designTagModel.getDesignTagsByDesignId(ctx, design?._id)
			: [];

		return SuccessData({ design, designProducts, designTags });
	}
});
