import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const otpTable = defineTable({
	email: v.string(),
	otp: v.string(),
	deleteSchedulerId: v.optional(v.id('_scheduled_functions'))
}).index('email', ['email']);

export const sessionTable = defineTable({
	userId: v.id('users'),
	createdAt: v.number(),
	expInDays: v.number()
}).index('user_id', ['userId']);
