import { v } from 'convex/values';

export const vUpdateUserValidator = v.object({
	email: v.optional(v.string()),
	firstName: v.optional(v.string()),
	lastName: v.optional(v.string()),
	fullName: v.optional(v.string()),
	imageUrl: v.optional(v.string()),
	phone: v.optional(v.string()),
	whatBroughtYouHere: v.optional(v.string()),
	howDidYouFindUs: v.optional(v.string()),
	currentWorkspaceId: v.optional(v.id('workspaces')),
	lastLoginAt: v.optional(v.number()),
	updatedAt: v.optional(v.number()),
	authToken: v.optional(v.string())
});
