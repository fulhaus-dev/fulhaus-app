import { defineTable } from 'convex/server';
import { v } from 'convex/values';
import { vOrderItemStatus } from './validator';

export const orderItemTable = defineTable({
	oid: v.string(),
	workspaceId: v.id('workspaces'),
	designId: v.id('designs'),
	productId: v.id('products'),
	price: v.float64(),
	quantity: v.number(),
	status: vOrderItemStatus
})
	.index('by_oid', ['oid'])
	.index('by_workspace', ['workspaceId'])
	.index('by_design', ['designId']);
