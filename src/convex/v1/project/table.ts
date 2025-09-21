import { defineTable } from 'convex/server';
import { v } from 'convex/values';
import { vFloorPlanFile } from '../../validator';

export const projectTable = defineTable({
	workspaceId: v.id('workspaces'),
	name: v.string(),
	description: v.string(),
	summary: v.string(),
	floorPlanFiles: v.optional(v.array(vFloorPlanFile)),
	publishedAt: v.optional(v.number()),
	createdById: v.id('users'),
	updatedById: v.id('users'),
	createdAt: v.number(),
	updatedAt: v.number(),
	deletedAt: v.optional(v.number())
}).index('by_workspace_id', ['workspaceId']);
