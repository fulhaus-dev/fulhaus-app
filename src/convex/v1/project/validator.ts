import { v } from 'convex/values';

export const vCreateProject = v.object({
	workspaceId: v.id('workspaces'),
	name: v.string(),
	description: v.string(),
	summary: v.string()
});

export const vUpdateProject = v.object({
	name: v.optional(v.string()),
	description: v.optional(v.string()),
	summary: v.optional(v.string())
});
