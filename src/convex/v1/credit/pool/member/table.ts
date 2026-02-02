import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const creditPoolMemberTable = defineTable({
	poolId: v.id('creditPools'),
	userId: v.id('users'),
	active: v.boolean(),
	totalUsed: v.number()
})
	.index('by_credit_pool_member', ['userId', 'poolId'])
	.index('by_credit_pool', ['poolId']);
