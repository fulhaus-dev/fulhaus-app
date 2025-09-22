import { v } from 'convex/values';
import { spaceTypes } from './space';
import { vProductCategory } from './product/validator';
import { vFloorPlanFile } from '../../validator';

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
	renderedImageUrl: v.optional(v.string()),
	renderingImage: v.optional(v.boolean())
});
