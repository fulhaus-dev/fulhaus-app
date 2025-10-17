import { defineTable } from 'convex/server';
import { v } from 'convex/values';
import { vCreateProductFields, vProductStatus } from './validator';

export const productTable = defineTable({
	...vCreateProductFields,
	embeddingId: v.id('productEmbeddings'),
	stockDate: v.number(),
	status: vProductStatus,
	updatedAt: v.number()
})
	.index('by_sku', ['sku'])
	.index('by_category', ['category'])
	.index('by_price_usd', ['retailPriceUSD'])
	.index('by_price_cad', ['retailPriceCAD'])
	.index('by_brand', ['brand'])
	.index('by_category_price_usd', ['category', 'retailPriceUSD'])
	.index('by_category_price_cad', ['category', 'retailPriceCAD'])
	.index('by_category_brand', ['category', 'brand'])
	.index('by_embedding_id', ['embeddingId']);
