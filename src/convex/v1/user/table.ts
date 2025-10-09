import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const userTable = defineTable({
	email: v.string(),
	emailVerifiedAt: v.optional(v.number()),
	fullName: v.optional(v.string()),
	firstName: v.optional(v.string()),
	lastName: v.optional(v.string()),
	imageUrl: v.optional(v.string()),
	phone: v.optional(v.string()),
	phoneVerifiedAt: v.optional(v.number()),
	currentWorkspaceId: v.optional(v.id('workspaces')),
	lastLoginAt: v.number(),
	updatedAt: v.number(),
	deletedAt: v.optional(v.number())
})
	.index('email', ['email'])
	.index('phone', ['phone'])
	.index('deleted_at', ['deletedAt']);
