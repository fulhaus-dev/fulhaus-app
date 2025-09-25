import { v } from 'convex/values';
import { internalQuery } from '../../../_generated/server';
import productModel from '../model';

export const getProductByPId = internalQuery({
	args: {
		pId: v.string()
	},
	handler: async (ctx, args) => await productModel.getProductByPId(ctx, args.pId)
});

export const getProductByLudwigImageUrl = internalQuery({
	args: {
		ludwigImageUrl: v.string()
	},
	handler: async (ctx, args) =>
		await productModel.getProductByLudwigImageUrl(ctx, args.ludwigImageUrl)
});

export const getProductById = internalQuery({
	args: {
		productId: v.id('products')
	},
	handler: async (ctx, args) => await productModel.getProductById(ctx, args.productId)
});
