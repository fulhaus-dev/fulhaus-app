import { defineTable } from 'convex/server';
import { v } from 'convex/values';
import { vCurrencyCode } from '../../validator';

export const cartItemTable = defineTable({
	workspaceId: v.id('workspaces'),
	designId: v.id('designs'),
	currencyCode: vCurrencyCode,
	productId: v.id('products'),
	quantity: v.number()
}).index('by_workspace_design_currency', ['workspaceId', 'currencyCode', 'designId']);
