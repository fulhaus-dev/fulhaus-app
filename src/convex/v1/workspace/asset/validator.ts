import { v } from 'convex/values';

export const vAssetMetadata = v.union(
	v.object({
		image: v.literal(false),
		name: v.string(),
		description: v.string(),
		key: v.string(),
		mime: v.string(),
		size: v.number()
	}),
	v.object({
		image: v.literal(true),
		name: v.string(),
		description: v.string(),
		key: v.string(),
		mime: v.string(),
		size: v.number(),
		width: v.number(),
		height: v.number()
	})
);

export const vWorkspaceAssetType = v.union(
	v.literal('inspo'),
	v.literal('floorplan'),
	v.literal('spaceImage')
);
