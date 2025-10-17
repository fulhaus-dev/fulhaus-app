import { v } from 'convex/values';

import { internalQuery } from '../../../../_generated/server';
import productEmbeddingModel from '../model';

export const getProductEmbeddingsById = internalQuery({
	args: {
		embeddingIds: v.array(v.id('productEmbeddings'))
	},
	handler: async (ctx, { embeddingIds }) => {
		return await Promise.all(
			embeddingIds.map((embeddingId) =>
				productEmbeddingModel.getProductEmbeddingById(ctx, embeddingId)
			)
		);
	}
});
