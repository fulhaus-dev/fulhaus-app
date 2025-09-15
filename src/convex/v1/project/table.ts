import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const projectTable = defineTable({
	workspaceId: v.id('workspaces'),
	name: v.string(),
	description: v.string(),
	summary: v.string(),
	createdById: v.id('users'),
	updatedById: v.id('users'),
	createdAt: v.number(),
	updatedAt: v.number(),
	deletedAt: v.optional(v.number())
}).index('by_workspace_id', ['workspaceId']);
