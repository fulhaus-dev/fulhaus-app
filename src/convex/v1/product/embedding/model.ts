import { Infer } from 'convex/values';
import { MutationCtx, QueryCtx } from '../../../_generated/server';
import { vCreateProductEmbedding } from './validator';
import { Id } from '../../../_generated/dataModel';

async function createProductEmbedding(
	ctx: MutationCtx,
	args: Infer<typeof vCreateProductEmbedding>
) {
	return await ctx.db.insert('productEmbeddings', args);
}

async function getProductEmbeddingById(ctx: QueryCtx, productEmbeddingId: Id<'productEmbeddings'>) {
	return await ctx.db.get(productEmbeddingId);
}

const productEmbeddingModel = {
	createProductEmbedding,
	getProductEmbeddingById
};

export default productEmbeddingModel;
