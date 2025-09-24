import { MutationCtx, QueryCtx } from '../../_generated/server';
import { Infer } from 'convex/values';
import { Id } from '../../_generated/dataModel';
import { vCreateProduct } from './validator';
import date from '../../util/date';

async function createProduct(ctx: MutationCtx, args: Infer<typeof vCreateProduct>) {
	return await ctx.db.insert('products', {
		...args,
		status: 'Active',
		stockDate: date.now(),
		updatedAt: date.now(),
		createdAt: date.now()
	});
}

async function getProductById(ctx: QueryCtx, productId: Id<'products'>) {
	return await ctx.db.get(productId);
}

async function getProductByPId(ctx: QueryCtx, pId: string) {
	return await ctx.db
		.query('products')
		.withIndex('by_product_id', (q) => q.eq('pId', pId))
		.first();
}

const productModel = {
	createProduct,
	getProductById,
	getProductByPId
};

export default productModel;
