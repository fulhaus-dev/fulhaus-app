import { defineTable } from 'convex/server';
import { v } from 'convex/values';
import { vSpaceType } from './validator';
import { vFloorPlanFile } from '../../validator';
import { vProductCategory, vProductStyle } from '../product/validator';

export const designTable = defineTable({
	workspaceId: v.id('workspaces'),
	chatId: v.id('chats'),
	name: v.string(),
	description: v.string(),
	spaceType: vSpaceType,
	inspirationImageUrl: v.string(),
	floorPlanUrl: v.optional(v.string()),
	floorPlanFile: v.optional(vFloorPlanFile),
	productCategories: v.array(vProductCategory),
	productIds: v.optional(v.array(v.id('products'))),
	renderedImageUrl: v.optional(v.string()),
	generatingFurnitureRecommendation: v.optional(v.boolean()),
	renderingImage: v.optional(v.boolean()),
	styles: v.optional(v.array(vProductStyle)),
	tags: v.optional(v.array(v.string())),
	publishedAt: v.optional(v.number()),
	createdById: v.id('users'),
	updatedById: v.id('users'),
	updatedAt: v.number(),
	deletedAt: v.optional(v.number())
})
	.index('by_workspace_id', ['workspaceId'])
	.index('by_workspace_space', ['workspaceId', 'spaceType'])
	.index('by_chat_id', ['chatId'])
	.index('by_floor_plan_url', ['floorPlanUrl']);

export const designTagTable = defineTable({
	workspaceId: v.id('workspaces'),
	designId: v.id('designs'),
	tag: v.string()
})
	.index('by_workspace_tag', ['workspaceId', 'tag'])
	.index('by_design_id', ['designId']);
