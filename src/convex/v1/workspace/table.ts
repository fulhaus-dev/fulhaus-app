import { defineTable } from 'convex/server';
import { v } from 'convex/values';
import { vCurrencyCode } from '../../validator';

export const workspaceTable = defineTable({
	name: v.string(),
	logoUrl: v.optional(v.string()),
	members: v.array(v.id('users')),
	currencyCodes: v.array(vCurrencyCode),
	createdById: v.id('users'),
	updatedById: v.id('users'),
	updatedAt: v.number(),
	deletedAt: v.optional(v.number())
}).index('deleted_at', ['deletedAt']);
