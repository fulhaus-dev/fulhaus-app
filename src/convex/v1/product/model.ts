import { MutationCtx, QueryCtx } from '../../_generated/server';
import { Infer } from 'convex/values';
import { Id } from '../../_generated/dataModel';
import { vCreateProduct } from './validator';
import date from '../../util/date';
import { SpaceType } from '../design/type';
import { spaceTypeProductCategories } from '../design/constant';
import { ClientProduct } from './type';

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

	const availableProducts = products.filter((product) => !!product);

	const designProducts: ClientProduct[] = availableProducts.map((product) => ({
		_id: product._id,
		fhSku: product.fhSku,
		brand: product.brand,
		name: product.name,
		description: product.description,
		pdpLink: product.pdpLink,
		retailPrice: product.msrp ?? product.tradePrice * 2,
		unitPerBox: product.unitPerBox,
		stockQty: product.stockQty,
		restockDate: product.restockDate,
		imageUrls: product.imageUrls,
		mainImageUrl: product.mainImageUrl,
		ludwigImageUrl: product.ludwigImageUrl,
		currencyCode: product.currencyCode,
		dimension: product.dimension,
		width: product.width,
		height: product.height,
		depth: product.depth,
		dimensionUnit: product.dimensionUnit,
		weight: product.weight,
		weightUnit: product.weightUnit,
		colorNames: product.colorNames,
		hexColors: product.hexColors,
		materials: product.materials,
		styles: product.styles,
		category: product.category,
		stockDate: product.stockDate
	}));

	return designProducts;
}

const productModel = {
	createProduct,
	getProductById,
	getProductByPId,
	getProductCategoriesForSpace,
	getProductsForClientByIds,
	getProductByLudwigImageUrl
};

export default productModel;
