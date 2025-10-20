import { v } from 'convex/values';
import { internalMutation } from '../../../_generated/server';
import productModel from '../model';

export const updateProductMainImageNoBgUrls = internalMutation({
	args: {
		productsNoBgImageMetadata: v.array(
			v.object({
				productId: v.id('products'),
				mainImageNoBgUrl: v.string()
			})
		)
	},
	handler: async (ctx, { productsNoBgImageMetadata }) => {
		await Promise.all(
			productsNoBgImageMetadata.map((metadata) =>
				productModel.updateProductMainImageNoBgUrl(
					ctx,
					metadata.productId,
					metadata.mainImageNoBgUrl
				)
			)
		);
	}
});
