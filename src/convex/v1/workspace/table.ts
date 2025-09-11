import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const workspaceTable = defineTable({
	name: v.string(),
	logoUrl: v.optional(v.string()),
	members: v.array(v.id('users')),
	createdById: v.id('users'),
	updatedById: v.id('users'),
	createdAt: v.number(),
	updatedAt: v.number(),
	deletedAt: v.optional(v.number())
}).index('deleted_at', ['deletedAt']);
