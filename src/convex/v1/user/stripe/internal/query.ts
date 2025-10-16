import { v } from 'convex/values';
import { internalQuery } from '../../../../_generated/server';
import { vCurrencyCode } from '../../../../validator';
import stripeUserModel from '../model';

export const getStripeUser = internalQuery({
	args: {
		userId: v.id('users'),
		currencyCode: vCurrencyCode
	},
	handler: async (ctx, args) => await stripeUserModel.getStripeUserByUserId(ctx, args)
});
