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
	.index('by_brand', ['brand', 'status'])
	.index('by_stock_qty', ['stockQty', 'status', 'category'])
	.index('by_width', ['width', 'status', 'category'])
	.index('by_height', ['height', 'status', 'category'])
	.index('by_depth', ['depth', 'status', 'category'])
	.index('by_weight', ['weight', 'status', 'category'])
	.index('by_category', ['category', 'status'])
	.index('by_status', ['status'])
	.index('by_ludwig_image_url', ['ludwigImageUrl']);
