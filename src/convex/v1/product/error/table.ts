import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const productErrorLogTable = defineTable({
	message: v.string(),
	details: v.optional(v.array(v.any()))
});
