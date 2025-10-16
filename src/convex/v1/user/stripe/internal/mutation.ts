import { v } from 'convex/values';
import { internalMutation } from '../../../../_generated/server';
import { vCurrencyCode } from '../../../../validator';
import stripeUserModel from '../model';

export const createStripeUserById = internalMutation({
	args: {
		userId: v.id('users'),
		stripeCustomerId: v.string(),
		currencyCode: vCurrencyCode
	},
	handler: async (ctx, args) => await stripeUserModel.createStripeUser(ctx, args)
});
