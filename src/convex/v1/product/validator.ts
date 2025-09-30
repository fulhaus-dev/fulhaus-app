import { v } from 'convex/values';
import { ISO_3166 } from './iso/3166';
import { ISO_4217 } from './iso/4217';
import { productCategories, productStyles } from './constant';

export const vProductStatus = v.union(
	v.literal('Active'),
	v.literal('Inactive'),
	v.literal('Discontinued')
);

export const vCountryAlpha2Code = v.union(...ISO_3166.map((country) => v.literal(country.alpha2)));
export const vCurrencyCode = v.union(...ISO_4217.map((iso) => v.literal(iso.code)));

export const vProductStyle = v.union(...productStyles.map((style) => v.literal(style)));
export const vProductCategory = v.union(
	...productCategories.map((category) => v.literal(category))
);

export const vCreateProductFields = {
	vendorId: v.id('productVendors'),
	ownerId: v.optional(v.id('workspaces')),
	pId: v.string(),
	sku: v.string(),
	fhSku: v.string(),
	itemId: v.optional(v.string()),
	gtin: v.optional(v.string()),
	mpn: v.optional(v.string()),
	brand: v.optional(v.string()),
	name: v.string(),
	description: v.string(),
	pdpLink: v.optional(v.string()),
	tradePrice: v.number(),
	map: v.optional(v.number()),
	msrp: v.optional(v.number()),
	shippingPrice: v.optional(v.number()),
	unitPerBox: v.number(),
	stockQty: v.number(),
	restockDate: v.optional(v.number()),
	imageUrls: v.array(v.string()),
	mainImageUrl: v.optional(v.string()),
	ludwigImageUrl: v.string(),
	warehouseCountryCodes: v.array(vCountryAlpha2Code),
	shippingCountryCodes: v.array(vCountryAlpha2Code),
	currencyCode: vCurrencyCode,
	dimension: v.optional(v.string()),
	width: v.number(),
	height: v.number(),
	depth: v.number(),
	shippingDimension: v.optional(v.string()),
	shippingWidth: v.number(),
	shippingHeight: v.number(),
	shippingDepth: v.number(),
	dimensionUnit: v.literal('in'),
	weight: v.number(),
	shippingWeight: v.number(),
	weightUnit: v.literal('lb'),
	colorNames: v.optional(v.array(v.string())),
	hexColors: v.optional(v.array(v.string())),
	materials: v.array(v.string()),
	styles: v.array(vProductStyle),
	category: v.string()
};

export const vCreateProduct = v.object(vCreateProductFields);

export const vClientProduct = v.object({
	_id: v.id('products'),
	fhSku: v.string(),
	brand: v.optional(v.string()),
	name: v.string(),
	description: v.string(),
	pdpLink: v.optional(v.string()),
	retailPrice: v.number(),
	unitPerBox: v.number(),
	stockQty: v.number(),
	restockDate: v.optional(v.number()),
	imageUrls: v.array(v.string()),
	mainImageUrl: v.optional(v.string()),
	ludwigImageUrl: v.string(),
	currencyCode: vCurrencyCode,
	dimension: v.optional(v.string()),
	width: v.number(),
	height: v.number(),
	depth: v.number(),
	dimensionUnit: v.literal('in'),
	weight: v.number(),
	weightUnit: v.literal('lb'),
	colorNames: v.optional(v.array(v.string())),
	hexColors: v.optional(v.array(v.string())),
	materials: v.array(v.string()),
	styles: v.array(vProductStyle),
	category: vProductCategory,
	stockDate: v.number()
});

const vProductAvailability = v.union(
	v.literal('In Stock'),
	v.literal('Low Stock'),
	v.literal('Out of Stock')
);

export const vProductFilter = v.object({
	category: v.optional(vProductCategory),
	name: v.optional(v.string()),
	availability: v.optional(vProductAvailability),
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
