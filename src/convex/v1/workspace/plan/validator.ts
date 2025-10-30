import { v } from 'convex/values';

export const vWorkspacePlan = v.union(
	v.literal('Free'),
	v.literal('Creator'),
	v.literal('Professional')
);

export const vUpdateWorkspacePlan = v.object({
	credit: v.optional(v.number()),
	used: v.optional(v.number()),
	plan: v.optional(vWorkspacePlan)
});
