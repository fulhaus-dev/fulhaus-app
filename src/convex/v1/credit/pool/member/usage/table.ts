import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const creditPoolMemberUsageTable = defineTable({
	poolId: v.id('creditPools'),
	memberId: v.id('creditPoolMembers'),
	used: v.number()
}).index('by_credit_pool_member', ['poolId', 'memberId']);
