import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const designTagTable = defineTable({
	workspaceId: v.id('workspaces'),
	designId: v.id('designs'),
	tag: v.string()
})
	.index('by_workspace_tag', ['workspaceId', 'tag'])
	.index('by_design_id', ['designId']);
