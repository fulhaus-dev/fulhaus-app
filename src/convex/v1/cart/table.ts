import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const cartItemTable = defineTable({
	workspaceId: v.id('workspaces'),
	productId: v.id('products'),
	quantity: v.number()
}).index('by_workspace_id', ['workspaceId']);
