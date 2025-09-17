import { v } from 'convex/values';
import { productCategories, spaceTypes } from '../../constant';

export const vSpaceType = v.union(...spaceTypes.map((tag) => v.literal(tag)));
export const vProductCategory = v.union(...productCategories.map((tag) => v.literal(tag)));

export const vCreateDesign = v.object({
	workspaceId: v.id('workspaces'),
	projectId: v.id('projects'),
	chatId: v.id('chats'),
	name: v.string(),
	description: v.string(),
	spaceType: vSpaceType,
	inspirationImageUrl: v.string(),
	floorPlanUrl: v.optional(v.string()),
	productCategories: v.array(vProductCategory)
});

export const vUpdateDesign = v.object({
	name: v.optional(v.string()),
	description: v.optional(v.string()),
	spaceType: v.optional(vSpaceType),
	inspirationImageUrl: v.optional(v.string()),
	floorPlanUrl: v.optional(v.string()),
	productCategories: v.optional(v.array(vProductCategory))
});
