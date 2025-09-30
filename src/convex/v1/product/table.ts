import { defineTable } from 'convex/server';
import { v } from 'convex/values';
import { vCreateProductFields, vProductStatus } from './validator';

export const productTable = defineTable({
	...vCreateProductFields,
	stockDate: v.number(),
	status: vProductStatus,
	createdAt: v.number(),
	updatedAt: v.number()
})
	.index('by_product_id', ['pId', 'status'])
	.index('by_fh_sku', ['fhSku', 'status'])
	.index('by_category', ['category', 'status'])
	.index('by_category_price', ['category', 'tradePrice', 'status'])
	.index('by_ludwig_image_url', ['ludwigImageUrl']);
