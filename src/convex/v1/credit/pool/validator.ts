import { v } from 'convex/values';

export const vCreateCreditPoolValidatorObject = {
	name: v.string(),
	credit: v.number(),
	used: v.number(),
	stripeSubscriptionId: v.optional(v.string())
};

export const vUpdateCreditPoolValidator = v.object(vCreateCreditPoolValidatorObject);
