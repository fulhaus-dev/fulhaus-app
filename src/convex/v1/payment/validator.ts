import { v } from 'convex/values';
import { vCurrencyCode } from '../../validator';
import { vWorkspacePlan } from '../workspace/plan/validator';

export const vPaymentType = v.union(v.literal('cart'), v.literal('credits'));

export const vPaymentMetadata = v.object({
	workspaceId: v.id('workspaces'),
	userId: v.id('users'),
	currencyCode: vCurrencyCode,
	plan: vWorkspacePlan,
	credit: v.optional(v.string()),
	type: vPaymentType
});

export const vStripeCustomerUpdateParams = v.object({
	balance: v.optional(v.number()),
	business_name: v.optional(v.string()),
	default_source: v.optional(v.string()),
	description: v.optional(v.string()),
	email: v.optional(v.string()),
	name: v.optional(v.string()),
	phone: v.optional(v.string()),
	metadata: v.optional(v.any())
});
