import { v } from 'convex/values';
import { mutation } from '../../_generated/server';
import productModel from './model';
import authorization from '../../middleware/authorization';
import { vCreateProduct, vUpdateProduct } from './validator';
import { SuccessData } from '../../response/success';

export const createPoProducts = mutation({
	args: {
		poApiKey: v.string(),
		data: v.array(vCreateProduct)
	},
	handler: async (ctx, args) => {
		authorization.authorizeProductOnboarding(args.poApiKey);

		const productIds = await Promise.all(
			args.data.map((product) => productModel.createProduct(ctx, product))
		);

		return SuccessData(productIds);
	}
});

export const updatePoProductsById = mutation({
	args: {
		poApiKey: v.string(),
		data: v.array(
			v.object({
				productId: v.id('products'),
				updates: vUpdateProduct
			})
		)
	},
	handler: async (ctx, args) => {
		authorization.authorizeProductOnboarding(args.poApiKey);

		await Promise.all(
			args.data.map((productUpdate) =>
				productModel.updateProductById(ctx, productUpdate.productId, productUpdate.updates)
			)
		);
	}
});
