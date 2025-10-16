import { defineTable } from 'convex/server';
import { v } from 'convex/values';
import { vCurrencyCode } from '../../../validator';

export const stripeUserTable = defineTable({
	userId: v.id('users'),
	stripeCustomerId: v.string(),
	currencyCode: vCurrencyCode
}).index('by_user_currency', ['userId', 'currencyCode']);
