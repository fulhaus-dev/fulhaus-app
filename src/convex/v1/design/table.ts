import { defineTable } from 'convex/server';
import { v } from 'convex/values';
import { vSpaceType } from './validator';
import { vProductCategory } from './product/validator';

export const designTable = defineTable({
	workspaceId: v.id('workspaces'),
	projectId: v.id('projects'),
	chatId: v.id('chats'),
	name: v.string(),
	description: v.string(),
	spaceType: vSpaceType,
	inspirationImageUrl: v.string(),
	floorPlanUrl: v.optional(v.string()),
	productCategories: v.array(vProductCategory),
	renderedImageUrl: v.optional(v.string()),
	createdById: v.id('users'),
	updatedById: v.id('users'),
	createdAt: v.number(),
	updatedAt: v.number(),
	deletedAt: v.optional(v.number())
})
	.index('by_project_id', ['projectId'])
	.index('by_chat_id', ['chatId']);
