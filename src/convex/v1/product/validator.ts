import { v } from 'convex/values';
import { productCategories, productStyles } from './constant';
import { vCurrencyCode } from '../../validator';

export const vProductStatus = v.union(
	v.literal('Active'),
	v.literal('Inactive'),
	v.literal('Discontinued')
);

export const vProductStyle = v.union(...productStyles.map((style) => v.literal(style)));
export const vProductCategory = v.union(
	...productCategories.map((category) => v.literal(category))
);

export const vProductPrice = v.object({
	currencyCode: vCurrencyCode,
	tradePrice: v.float64(),
	map: v.optional(v.float64()),
	msrp: v.optional(v.float64()),
	retailPrice: v.float64()
});

export const vCreateProductFields = {
	vendorId: v.id('productVendors'),
	ownerId: v.string(),
	location: v.optional(v.string()),
	sku: v.string(),
	fhSku: v.string(),
	itemId: v.optional(v.string()),
	gtin: v.optional(v.string()),
	mpn: v.optional(v.string()),
	brand: v.optional(v.string()),
	name: v.string(),
	description: v.string(),
	pdpLink: v.optional(v.string()),
	prices: v.array(vProductPrice),
	hasCAD: v.optional(v.boolean()),
	hasUSD: v.optional(v.boolean()),
	retailPriceCAD: v.optional(v.float64()),
	retailPriceUSD: v.optional(v.float64()),
	unitPerBox: v.number(),
	imageUrls: v.array(v.string()),
	mainImageUrl: v.string(),
	mainImageNoBgUrl: v.optional(v.string()),
	dimension: v.optional(v.string()),
	width: v.optional(v.number()),
	height: v.optional(v.number()),
	depth: v.optional(v.number()),
	dimensionUnit: v.literal('in'),
	vDimension: v.optional(v.string()),
	weight: v.optional(v.number()),
	weightUnit: v.literal('lb'),
	colorNames: v.array(v.string()),
	hexColors: v.array(v.string()),
	materials: v.array(v.string()),
	styles: v.array(vProductStyle),
	category: vProductCategory,
	stockQtyUSD: v.number(),
	stockQtyCAD: v.number(),
	restockDateUSD: v.optional(v.number()),
	restockDateCAD: v.optional(v.number())
};

export const vCreateProduct = v.object(vCreateProductFields);

export const vClientProduct = v.object({
	_id: v.id('products'),
	fhSku: v.string(),
	brand: v.optional(v.string()),
	name: v.string(),
	description: v.string(),
	retailPrice: v.number(),
	unitPerBox: v.number(),
	stockQty: v.number(),
	restockDate: v.optional(v.number()),
	imageUrls: v.array(v.string()),
	mainImageUrl: v.string(),
	currencyCode: vCurrencyCode,
	dimension: v.optional(v.string()),
	width: v.optional(v.number()),
	height: v.optional(v.number()),
	depth: v.optional(v.number()),
	dimensionUnit: v.literal('in'),
	weight: v.optional(v.number()),
	weightUnit: v.literal('lb'),
	colorNames: v.array(v.string()),
	hexColors: v.array(v.string()),
	materials: v.array(v.string()),
	styles: v.array(vProductStyle),
	category: vProductCategory,
	stockDate: v.number()
});

export const vUpdateProduct = v.object({
	prices: v.optional(v.array(vProductPrice)),
	hasCAD: v.optional(v.boolean()),
	hasUSD: v.optional(v.boolean()),
	retailPriceCAD: v.optional(v.float64()),
	retailPriceUSD: v.optional(v.float64()),
	stockDate: v.optional(v.number()),
	restockDate: v.optional(v.number()),
	status: v.optional(vProductStatus),
	stockQtyUSD: v.optional(v.number()),
	stockQtyCAD: v.optional(v.number()),
	restockDateUSD: v.optional(v.number()),
	restockDateCAD: v.optional(v.number())
});

const vProductAvailabilityFilter = v.union(
	v.literal('In Stock'),
	v.literal('Low Stock'),
	v.literal('Out of Stock')
);

export const vProductFilter = v.object({
	category: v.optional(vProductCategory),
	name: v.optional(v.string()),
	availability: v.optional(vProductAvailabilityFilter),
	minPrice: v.optional(v.number()),
	maxPrice: v.optional(v.number()),
	minWidth: v.optional(v.number()),
	maxWidth: v.optional(v.number()),
	minHeight: v.optional(v.number()),
	maxHeight: v.optional(v.number()),
	minDepth: v.optional(v.number()),
	maxDepth: v.optional(v.number()),
	minWeight: v.optional(v.number()),
	maxWeight: v.optional(v.number()),
	brand: v.optional(v.string())
});

export const vProductSortOptions = v.object({
	index: v.union(
		v.literal('by_category_price_usd'),
		v.literal('by_category_price_cad'),
		v.literal('by_price_usd'),
		v.literal('by_price_cad')
	),
	order: v.union(v.literal('asc'), v.literal('desc'))
});

export const vProductPaginationOptions = v.object({
	cursor: v.optional(v.string()),
	numItems: v.optional(v.number())
});

export const vProductRecommendationFilter = v.object({
	minPrice: v.optional(v.float64()),
	maxPrice: v.optional(v.float64()),
	minWidth: v.optional(v.number()),
	maxWidth: v.optional(v.number()),
	minHeight: v.optional(v.number()),
	maxHeight: v.optional(v.number()),
	minDepth: v.optional(v.number()),
	maxDepth: v.optional(v.number())
});
