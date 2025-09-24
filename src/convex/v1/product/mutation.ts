import { v } from 'convex/values';
import { mutation } from '../../_generated/server';
import productModel from './model';
import authorization from '../../middleware/authorization';
import { vCreateProduct } from './validator';

export const createProduct = mutation({
	args: {
		poApiKey: v.string(),
		data: vCreateProduct
	},
	handler: async (ctx, args) => {
		authorization.authorizeProductOnboarding(args.poApiKey);
		await productModel.createProduct(ctx, args.data);
	}
});
