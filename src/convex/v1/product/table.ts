import { defineTable } from 'convex/server';
import { v } from 'convex/values';
import { vCreateProductFields, vProductStatus } from './validator';

export const productTable = defineTable({
	...vCreateProductFields,
	embeddingId: v.id('productEmbeddings'),
	stockDate: v.number(),
	status: vProductStatus,
	fullTextSearch: v.string(),
	updatedAt: v.number()
})
	.index('by_sku', ['sku', 'ownerId'])
	.index('by_category', ['category', 'hasCAD', 'hasUSD', 'ownerId'])
	.index('by_price_usd', ['retailPriceUSD', 'ownerId'])
	.index('by_price_cad', ['retailPriceCAD', 'ownerId'])
	.index('by_brand', ['brand'])
	.index('by_category_price_usd', ['category', 'hasCAD', 'hasUSD', 'retailPriceUSD', 'ownerId'])
	.index('by_category_price_cad', ['category', 'hasCAD', 'hasUSD', 'retailPriceCAD', 'ownerId'])
	.index('by_category_brand', ['category', 'brand', 'ownerId'])
	.index('by_embedding_id', ['embeddingId', 'ownerId'])
	.searchIndex('by_full_text_search', {
		searchField: 'fullTextSearch',
		filterFields: ['hasCAD', 'hasUSD']
	});
