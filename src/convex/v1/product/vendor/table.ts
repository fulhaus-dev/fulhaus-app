import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const productVendorTable = defineTable({
	vId: v.string(),
	name: v.string(),
	r2FolderId: v.string(),
	createdAt: v.number(),
	updatedAt: v.number(),
	deletedAt: v.optional(v.number())
})
	.index('by_vendor_id', ['vId'])
	.index('by_deleted_at', ['deletedAt']);
