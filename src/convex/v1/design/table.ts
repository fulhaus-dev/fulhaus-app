import { defineTable } from 'convex/server';
import { v } from 'convex/values';
import { vDesignProductCategory, vSpaceType } from './validator';
import { vCurrencyCode, vFloorPlanFile } from '../../validator';

export const designTable = defineTable({
	workspaceId: v.id('workspaces'),
	chatId: v.id('chats'),
	name: v.string(),
	description: v.string(),
	spaceType: vSpaceType,
	inspirationImageUrl: v.string(),
	floorPlanUrl: v.optional(v.string()),
	floorPlanFile: v.optional(vFloorPlanFile),
	productCategories: v.array(vDesignProductCategory),
	productIds: v.optional(v.array(v.id('products'))),
	renderedImageUrl: v.optional(v.string()),
	generatingFurnitureRecommendation: v.optional(v.boolean()),
	renderingImage: v.optional(v.boolean()),
	generateRender: v.optional(v.boolean()),
	publishedAt: v.optional(v.number()),
	fullTextSearch: v.string(),
	currencyCode: vCurrencyCode,
	createdById: v.id('users'),
	updatedById: v.id('users'),
	updatedAt: v.number(),
	deletedAt: v.optional(v.number())
})
	.index('by_workspace_id', ['workspaceId'])
	.index('by_workspace_space', ['workspaceId', 'spaceType'])
	.index('by_chat_id', ['chatId'])
	.index('by_floor_plan_url', ['floorPlanUrl'])
	.searchIndex('by_full_text_search', {
		searchField: 'fullTextSearch'
	});
