import { v } from 'convex/values';
import { spaceTypes } from './constant';
import { vFloorPlanFile } from '../../validator';
import { vProductCategory } from '../product/validator';

export const vSpaceType = v.union(...spaceTypes.map((tag) => v.literal(tag)));

export const vCreateDesign = v.object({
	workspaceId: v.id('workspaces'),
	projectId: v.id('projects'),
	chatId: v.id('chats'),
	name: v.string(),
	description: v.string(),
	spaceType: vSpaceType,
	inspirationImageUrl: v.string(),
	floorPlanFile: v.optional(vFloorPlanFile),
	productCategories: v.array(vProductCategory)
});

export const vUpdateDesign = v.object({
	name: v.optional(v.string()),
	description: v.optional(v.string()),
	spaceType: v.optional(vSpaceType),
	inspirationImageUrl: v.optional(v.string()),
	floorPlanFile: v.optional(vFloorPlanFile),
	productCategories: v.optional(v.array(vProductCategory)),
	productIds: v.optional(v.array(v.id('products'))),
	renderedImageUrl: v.optional(v.string()),
	renderingImage: v.optional(v.boolean()),
	generatingFurnitureRecommendation: v.optional(v.boolean())
});
