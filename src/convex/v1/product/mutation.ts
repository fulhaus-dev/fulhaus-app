import { v } from 'convex/values';
import productModel from './model';
import authorization from '../../middleware/authorization';
import { vCreateProduct, vUpdateProduct } from './validator';
import { SuccessData } from '../../response/success';
import { productMutation } from './statistics/trigger';

export const createPoProducts = productMutation({
	args: {
		poApiKey: v.string(),
		data: v.array(
			v.object({
				productData: vCreateProduct,
				imageEmbedding: v.array(v.float64())
			})
		)
	},
	handler: async (ctx, args) => {
		authorization.authorizeProductOnboarding(args.poApiKey);

		const productIds = await Promise.all(args.data.map((d) => productModel.createProduct(ctx, d)));

		return SuccessData(productIds);
	}
});

export const updatePoProductsById = productMutation({
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
