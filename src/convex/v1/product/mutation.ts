import { v } from 'convex/values';
import productModel from './model';
import authorization from '../../middleware/authorization';
import { vCreateProduct, vUpdateProduct } from './validator';
import { SuccessData } from '../../response/success';
import { productMutation } from './statistics/trigger';
import { vReturnedSuccessData } from '../../response/validator';

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
	returns: vReturnedSuccessData(v.object({ productIds: v.array(v.id('products')) })),
	handler: async (ctx, args) => {
		authorization.authorizeProductOnboarding(args.poApiKey);

		const productIds = await Promise.all(args.data.map((d) => productModel.createProduct(ctx, d)));

		return SuccessData({ productIds });
	}
});

export const updatePoProductById = productMutation({
	args: {
		poApiKey: v.string(),
		data: v.object({
			productId: v.id('products'),
			updates: vUpdateProduct
		})
	},
	returns: v.null(),
	handler: async (ctx, args) => {
		authorization.authorizeProductOnboarding(args.poApiKey);

		const productUpdate = args.data;

		await productModel.updateProductById(ctx, productUpdate.productId, productUpdate.updates);
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
	returns: v.null(),
	handler: async (ctx, args) => {
		authorization.authorizeProductOnboarding(args.poApiKey);

		await Promise.all(
			args.data.map((productUpdate) =>
				productModel.updateProductById(ctx, productUpdate.productId, productUpdate.updates)
			)
		);
	}
});
