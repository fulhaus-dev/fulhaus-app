import { defineTable } from 'convex/server';
import { v } from 'convex/values';
import { vCreateCreditPoolValidatorObject } from './validator';

export const creditPoolTable = defineTable({
	...vCreateCreditPoolValidatorObject,
	updatedAt: v.number(),
	deletedAt: v.optional(v.number())
});
