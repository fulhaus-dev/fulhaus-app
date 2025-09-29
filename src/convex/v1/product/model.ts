import { MutationCtx, QueryCtx } from '../../_generated/server';
import { Infer } from 'convex/values';
import { Id } from '../../_generated/dataModel';
import { vCreateProduct } from './validator';
import date from '../../util/date';
import { SpaceType } from '../design/type';
import { spaceTypeProductCategories } from '../design/constant';
import { filterClientProducts, productsToClientProducts } from './util';
import { ClientProduct, ProductCategory, ProductFilter } from './type';
import { paginator } from 'convex-helpers/server/pagination';
import schema from '../../schema';

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
	cursor?: string,
	numItems: number = 25
) {
	const page = await paginator(ctx.db, schema)
		.query('products')
		.withIndex('by_category', (q) => q.eq('category', category).eq('status', 'Active'))
		.paginate({
			cursor: cursor ?? null,
			numItems
		});

	const { page: products, isDone, continueCursor } = page;

	const clientProducts = productsToClientProducts(products);

	return {
		clientProducts,
		isDone,
		continueCursor
	};
}

async function getClientProductsByCategoryWithFilters(
	ctx: QueryCtx,
	args: {
		category: ProductCategory;
		cursor?: string;
		numItems?: number;
		productFilter?: ProductFilter;
	}
) {
	const { category, cursor, numItems = 25, productFilter } = args;

	const clientProducts: ClientProduct[] = [];
	let isDone = false;
	let continueCursor = cursor;
	let newNumItems = numItems;

	while (clientProducts.length < numItems && !isDone) {
		const clientProductPaginationResult = await getClientProductsByCategory(
			ctx,
			category,
			continueCursor,
			newNumItems
		);

		const filteredClientProducts = filterClientProducts(
			clientProductPaginationResult.clientProducts,
			productFilter
		);

		clientProducts.push(...filteredClientProducts);

		newNumItems = numItems - clientProducts.length;
		isDone = clientProductPaginationResult.isDone;
		continueCursor = clientProductPaginationResult.continueCursor;
	}

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
	getClientProductsByCategory,
	getClientProductsByCategoryWithFilters
};

export default productModel;
