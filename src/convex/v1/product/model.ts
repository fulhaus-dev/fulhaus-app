import { MutationCtx, QueryCtx } from '../../_generated/server';
import { Infer } from 'convex/values';
import { Id } from '../../_generated/dataModel';
import { vCreateProduct } from './validator';
import date from '../../util/date';
import { SpaceType } from '../design/type';
import { spaceTypeProductCategories } from '../design/constant';
import { productsToClientProducts } from './util';
import { ProductCategory } from './type';

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

async function getProductByLudwigImageUrl(ctx: QueryCtx, ludwigImageUrl: string) {
	return await ctx.db
		.query('products')
		.withIndex('by_ludwig_image_url', (q) => q.eq('ludwigImageUrl', ludwigImageUrl))
		.first();
}

function getProductCategoriesForSpace(spaceType: SpaceType) {
	return spaceTypeProductCategories[spaceType];
}

async function getProductsForClientByIds(ctx: QueryCtx, productIds: Id<'products'>[]) {
	// TODO: Handle send products with active status
	const products = await Promise.all(productIds.map((productId) => getProductById(ctx, productId)));

	const clientProducts = productsToClientProducts(
		products.filter((product) => product?.status === 'Active')
	);
	return clientProducts;
}

async function getClientProductsByCategory(
	ctx: QueryCtx,
	category: ProductCategory,
	cursor?: string
) {
	const page = await ctx.db
		.query('products')
		.withIndex('by_category', (q) => q.eq('category', category).eq('status', 'Active'))
		.paginate({
			cursor: cursor ?? null,
			numItems: 25
		});

	const { page: products, isDone, continueCursor } = page;

	const clientProducts = productsToClientProducts(products);
	return {
		clientProducts,
		isDone,
		continueCursor
	};
}

const productModel = {
	createProduct,
	getProductById,
	getProductByPId,
	getProductCategoriesForSpace,
	getProductsForClientByIds,
	getProductByLudwigImageUrl,
	getClientProductsByCategory
};

export default productModel;
