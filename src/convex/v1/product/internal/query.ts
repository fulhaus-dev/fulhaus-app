import { v } from 'convex/values';
import { internalQuery } from '../../../_generated/server';
import productModel from '../model';

export const getProductById = internalQuery({
	args: {
		productId: v.id('products')
	},
	handler: async (ctx, args) => await productModel.getProductById(ctx, args.productId)
});
