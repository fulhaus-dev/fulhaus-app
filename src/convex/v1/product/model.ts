import { MutationCtx, QueryCtx } from '../../_generated/server';
import { Infer } from 'convex/values';
import { Doc, Id } from '../../_generated/dataModel';
import { vCreateProduct, vUpdateProduct } from './validator';
import date from '../../util/date';
import { SpaceType } from '../design/type';
import { spaceTypeProductCategories } from '../design/constant';
import { filterClientProducts, productsToClientProducts } from './util';
import {
	ClientProduct,
	OrderProduct,
	Product,
	ProductCategory,
	ProductFilter,
	ProductPaginationOptions,
	ProductSortOptions
} from './type';
import { paginator } from 'convex-helpers/server/pagination';
import schema from '../../schema';
import type { PaginationResult } from 'convex/server';
import { CurrencyCode } from '../../type';
import { productCategories } from './constant';
import productEmbeddingModel from './embedding/model';
import productVendorModel from './vendor/model';

async function createProduct(
	ctx: MutationCtx,
	args: {
		productData: Infer<typeof vCreateProduct>;
		imageEmbedding: number[];
	}
) {
	const { productData, imageEmbedding } = args;

	const productEmbeddingId = await productEmbeddingModel.createProductEmbedding(ctx, {
		categoryUSD: productData.hasUSD ? productData.category : undefined,
		categoryCAD: productData.hasCAD ? productData.category : undefined,
		retailPriceCAD: productData.retailPriceCAD,
		retailPriceUSD: productData.retailPriceUSD,
		width: productData.width,
		height: productData.height,
		depth: productData.depth,
		weight: productData.weight,
		imageEmbedding
	});

	return await ctx.db.insert('products', {
		...productData,
		embeddingId: productEmbeddingId,
		status: 'Active',
		fullTextSearch: `${productData.name} | ${productData.description} | ${productData.styles.join(', ')} | ${productData.materials.join(', ')} | ${productData.colorNames.join(', ')} | ${productData.category}`,
		stockDate: date.now(),
		updatedAt: date.now()
	});
}

async function getProductById(ctx: QueryCtx, productId: Id<'products'>) {
	return await ctx.db.get(productId);
}

async function updateProductById(
	ctx: MutationCtx,
	productId: Id<'products'>,
	args: Infer<typeof vUpdateProduct>
) {
	return await ctx.db.patch(productId, {
		...args,
		updatedAt: date.now()
	});
}

async function updateProductMainImageNoBgUrl(
	ctx: MutationCtx,
	productId: Id<'products'>,
	mainImageNoBgUrl: string
) {
	return await ctx.db.patch(productId, {
		mainImageNoBgUrl,
		updatedAt: date.now()
	});
}

async function getProductBySku(ctx: QueryCtx, sku: string) {
	return await ctx.db
		.query('products')
		.withIndex('by_sku', (q) => q.eq('sku', sku))
		.first();
}

function getProductCategories() {
	return productCategories;
}

function getProductCategoriesForSpace(spaceType: SpaceType) {
	return spaceTypeProductCategories[spaceType];
}

async function getProductsForClientByIds(
	ctx: QueryCtx,
	args: { productIds: Id<'products'>[]; currencyCode: CurrencyCode }
) {
	// TODO: Handle send products with active status
	const products = await Promise.all(
		args.productIds.map((productId) => getProductById(ctx, productId))
	);

	const clientProducts = productsToClientProducts(
		products.filter((product) => product?.status === 'Active'),
		args.currencyCode
	);
	return clientProducts;
}

async function getClientProducts(
	ctx: QueryCtx,
	currencyCode: CurrencyCode,
	paginationOptions?: ProductPaginationOptions,
	sortOptions?: ProductSortOptions
) {
	const { cursor, numItems = 25 } = paginationOptions ?? {};

	let page: PaginationResult<Product> | null = null;

	if (!sortOptions)
		page = await paginator(ctx.db, schema)
			.query('products')
			.filterWith(async (doc) => doc.status === 'Active')
			.paginate({
				cursor: cursor ?? null,
				numItems
			});

	if (sortOptions)
		page = await paginator(ctx.db, schema)
			.query('products')
			.withIndex(sortOptions.index)
			.order(sortOptions.order)
			.filterWith(async (doc) => doc.status === 'Active')
			.paginate({
				cursor: cursor ?? null,
				numItems
			});

	const { page: products, isDone, continueCursor } = page ?? ({} as PaginationResult<Product>);

	const clientProducts = productsToClientProducts(products, currencyCode);

	return {
		clientProducts,
		isDone,
		continueCursor
	};
}

async function getClientProductsByCategory(
	ctx: QueryCtx,
	currencyCode: CurrencyCode,
	args: {
		category: ProductCategory;
		paginationOptions?: ProductPaginationOptions;
		sortOptions?: ProductSortOptions;
	}
) {
	const { category, paginationOptions = {}, sortOptions } = args;

	const { cursor, numItems = 25 } = paginationOptions;
	let page: PaginationResult<Product> | null = null;

	if (!sortOptions)
		page = await paginator(ctx.db, schema)
			.query('products')
			.withIndex('by_category', (q) => q.eq('category', category))
			.filterWith(async (doc) => doc.status === 'Active')
			.paginate({
				cursor: cursor ?? null,
				numItems
			});

	if (sortOptions)
		page = await paginator(ctx.db, schema)
			.query('products')
			.withIndex(sortOptions.index, (q) => q.eq('category', category))
			.order(sortOptions.order)
			.filterWith(async (doc) => doc.status === 'Active')
			.paginate({
				cursor: cursor ?? null,
				numItems
			});

	const { page: products, isDone, continueCursor } = page ?? ({} as PaginationResult<Product>);

	const clientProducts = productsToClientProducts(products, currencyCode);

	return {
		clientProducts,
		isDone,
		continueCursor
	};
}

async function getClientProductsByCategoryWithFilters(
	ctx: QueryCtx,
	currencyCode: CurrencyCode,
	args: {
		category: ProductCategory;
		productFilter?: ProductFilter;
		paginationOptions?: ProductPaginationOptions;
		sortOptions?: ProductSortOptions;
	}
) {
	const { productFilter } = args;
	const { cursor, numItems = 25 } = args.paginationOptions ?? {};

	const clientProducts: ClientProduct[] = [];
	let isDone = false;
	let continueCursor = cursor;
	let newNumItems = numItems;

	while (clientProducts.length < numItems && !isDone) {
		const clientProductPaginationResult = await getClientProductsByCategory(ctx, currencyCode, {
			category: args.category,
			paginationOptions: {
				cursor: continueCursor,
				numItems: newNumItems
			},
			sortOptions: args.sortOptions
		});

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

async function getProductBrands(
	ctx: QueryCtx,
	category?: ProductCategory,
	paginationOptions?: ProductPaginationOptions
) {
	const { cursor, numItems = 25 } = paginationOptions ?? {};

	const brands: (string | undefined)[] = [];

	let doc: Doc<'products'> | null = null;
	let lastUniqueBrand = cursor;

	if (!lastUniqueBrand) {
		if (category)
			doc = await ctx.db
				.query('products')
				.withIndex('by_category_brand', (q) => q.eq('category', category))
				.order('desc')
				.first();
		else doc = await ctx.db.query('products').withIndex('by_brand').order('desc').first();
	}

	if (lastUniqueBrand) await getUniqueBrand();

	while (brands.length < numItems && doc !== null) {
		brands.push(doc.brand);
		lastUniqueBrand = doc.brand;

		await getUniqueBrand();
	}

	async function getUniqueBrand() {
		if (category)
			doc = await ctx.db
				.query('products')
				.withIndex('by_category_brand', (q) =>
					q.eq('category', category).lt('brand', lastUniqueBrand)
				)
				.order('desc')
				.first();
		else
			doc = await ctx.db
				.query('products')
				.withIndex('by_brand', (q) => q.lt('brand', lastUniqueBrand))
				.order('desc')
				.first();
	}

	const uniqueBrands = brands.filter((brand) => brand !== undefined);

	return {
		brands: uniqueBrands,
		cursor: uniqueBrands.slice(-1)?.[0],
		isDone: doc === null
	};
}

async function getProductByEmbeddingId(ctx: QueryCtx, embeddingId: Id<'productEmbeddings'>) {
	return await ctx.db
		.query('products')
		.withIndex('by_embedding_id', (q) => q.eq('embeddingId', embeddingId))
		.first();
}

async function getClientProductsByFullTextSearch(
	ctx: QueryCtx,
	currencyCode: CurrencyCode,
	searchText: string
) {
	const filter = currencyCode === 'CAD' ? 'hasCAD' : 'hasUSD';

	const products = await ctx.db
		.query('products')
		.withSearchIndex('by_full_text_search', (q) =>
			q.search('fullTextSearch', searchText).eq(filter, true)
		)
		.take(100);

	const clientProducts = productsToClientProducts(products, currencyCode);

	return clientProducts;
}

async function getOrderProduct(ctx: QueryCtx, productId: Id<'products'>) {
	const product = await ctx.db.get(productId);
	if (!product) return null;

	const productVendor = await productVendorModel.getProductVendor(ctx, product.vendorId);
	if (!productVendor) return null;

	const orderProduct: OrderProduct = {
		productId: product._id,
		vendorId: product.vendorId,
		vendorName: productVendor.name,
		location: product.location,
		sku: product.sku,
		itemId: product.itemId,
		gtin: product.gtin,
		mpn: product.mpn,
		brand: product.brand,
		name: product.name,
		description: product.description,
		pdpLink: product.pdpLink,
		unitPerBox: product.unitPerBox,
		imageUrls: product.imageUrls,
		mainImageUrl: product.mainImageUrl,
		dimension: product.dimension,
		weight: product.weight,
		weightUnit: product.weightUnit,
		category: product.category
	};

	return orderProduct;
}

const productModel = {
	createProduct,
	getProductById,
	updateProductById,
	updateProductMainImageNoBgUrl,
	getProductBySku,
	getProductCategories,
	getProductCategoriesForSpace,
	getProductsForClientByIds,
	getClientProducts,
	getClientProductsByCategory,
	getClientProductsByCategoryWithFilters,
	getProductBrands,
	getProductByEmbeddingId,
	getClientProductsByFullTextSearch,
	getOrderProduct
};

export default productModel;
