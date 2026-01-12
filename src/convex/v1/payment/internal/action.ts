import { v } from 'convex/values';
import { internalAction } from '../../../_generated/server';
import paymentModel from '../model';
import stripeModel from '../stripe';
import { vCurrencyCode } from '../../../validator';
import { vStripeCustomerUpdateParams } from '../validator';

export const cancelSubscription = internalAction({
	args: {
		subscriptionId: v.string()
	},
	handler: async (_, args) => {
		await paymentModel.cancelSubscription(args.subscriptionId);
	}
});

export const createStripeCustomer = internalAction({
	args: {
		userId: v.id('users'),
		currencyCode: vCurrencyCode
	},
	handler: async (ctx, args) => {
		await stripeModel.createStripeCustomer(ctx, args.userId, args.currencyCode);
	}
});

export const updateStripeCustomer = internalAction({
	args: {
		userId: v.id('users'),
		currencyCode: vCurrencyCode,
		updates: vStripeCustomerUpdateParams
	},
	handler: async (ctx, args) => {
		await stripeModel.updateStripeCustomer(ctx, args);
	}
});
