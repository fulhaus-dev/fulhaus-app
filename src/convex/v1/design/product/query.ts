import { v } from 'convex/values';
import { query } from '../../../_generated/server';
import authorization from '../../../middleware/authorization';
import { SuccessData } from '../../../response/success';
import { vSpaceType } from '../validator';
import designProductModel from './model';

export const getDesignProductCategoriesForSpace = query({
	args: {
		spaceType: vSpaceType
	},
	handler: async (ctx, args) => {
		await authorization.userIsAuthenticated(ctx);

		const productCategories = designProductModel.getDesignProductCategoriesForSpace(args.spaceType);

		return SuccessData(productCategories.all ?? []);
	}
});

export const getDesignProductsByChatId = query({
	args: {
		chatId: v.id('chats')
	},
	handler: async (ctx, args) => {
		await authorization.userIsAuthenticated(ctx);

		const designProducts = await designProductModel.getDesignProductsByChatId(ctx, args.chatId);

		return SuccessData(designProducts);
	}
});
