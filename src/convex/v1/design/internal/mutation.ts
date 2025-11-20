import { v } from 'convex/values';
import { internalMutation } from '../../../_generated/server';
import { vCreateDesign, vUpdateDesign } from '../validator';
import designModel from '../model';
import { vCurrencyCode } from '../../../validator';

export const createDesign = internalMutation({
	args: {
		userId: v.id('users'),
		create: vCreateDesign
	},
	handler: async (ctx, args) => {
		return await designModel.createDesign(ctx, args.userId, args.create);
	}
});

export const updateDesignById = internalMutation({
	args: {
		designId: v.id('designs'),
		userId: v.id('users'),
		update: vUpdateDesign
	},
	handler: async (ctx, args) => {
		return await designModel.updateDesignById(ctx, args.designId, args.userId, args.update);
	}
});

export const updateDesignPrice = internalMutation({
	args: {
		designId: v.id('designs'),
		currencyCode: vCurrencyCode,
		userId: v.id('users')
	},
	handler: async (ctx, args) => {
		const designProducts = await designModel.getDesignProducts(
			ctx,
			args.designId,
			args.currencyCode
		);

		const totalPrice = designProducts.reduce((acc, designProduct) => {
			return acc + designProduct.retailPrice;
		}, 0);

		return await designModel.updateDesignPrice(ctx, args.designId, totalPrice);
	}
});
