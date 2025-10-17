import { v } from 'convex/values';
import { internalQuery } from '../../../_generated/server';
import productModel from '../model';

export const getProductById = internalQuery({
	args: {
		productId: v.id('products')
	},
	handler: async (ctx, args) => {
		return await productModel.getProductById(ctx, args.productId);
	}
});

export const getProductsByEmbeddingId = internalQuery({
	args: {
		embeddingIds: v.array(v.id('productEmbeddings'))
	},
	handler: async (ctx, args) => {
		return await Promise.all(
			args.embeddingIds.map((embeddingId) => productModel.getProductByEmbeddingId(ctx, embeddingId))
		);
	}
});
