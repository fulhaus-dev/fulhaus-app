import { v } from 'convex/values';
import { vDesignProductCategory, vSpaceType } from '../validator';
import { vFloorPlanFile } from '../../../validator';

export const vDesignLog = v.object({
	name: v.optional(v.string()),
	description: v.optional(v.string()),
	spaceType: v.optional(vSpaceType),
	inspirationImageUrl: v.optional(v.string()),
	spaceImageUrl: v.optional(v.string()),
	floorPlanFile: v.optional(vFloorPlanFile),
	productCategories: v.optional(v.array(vDesignProductCategory)),
	productIds: v.optional(v.array(v.id('products'))),
	renderedImageUrl: v.optional(v.string())
});
