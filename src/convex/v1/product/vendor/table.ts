import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const productVendorTable = defineTable({
	vId: v.string(),
	name: v.string(),
	r2FolderId: v.string(),
	updatedAt: v.number(),
	deletedAt: v.optional(v.number())
}).index('by_vendor_id', ['vId']);
