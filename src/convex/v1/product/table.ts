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
	.index('by_product_id', ['pId'])
	.index('by_fh_sku', ['fhSku'])
	.index('by_brand', ['brand'])
	.index('by_stock_qty', ['stockQty'])
	.index('by_width', ['width'])
	.index('by_height', ['height'])
	.index('by_depth', ['depth'])
	.index('by_weight', ['weight'])
	.index('by_category', ['category'])
	.index('by_status', ['status'])
	.index('by_ludwig_image_url', ['ludwigImageUrl']);
