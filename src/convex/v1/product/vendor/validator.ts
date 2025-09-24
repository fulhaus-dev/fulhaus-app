import { v } from 'convex/values';

export const vCreateVendor = v.object({
	vId: v.string(),
	name: v.string(),
	r2FolderId: v.string()
});
