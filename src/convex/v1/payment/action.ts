'use node';

import { v } from 'convex/values';
import { action } from '../../_generated/server';
import { vCurrencyCode } from '../../validator';
import authorization from '../../middleware/authorization';
import paymentModel from './model';
import { SuccessData } from '../../response/success';
import ServerError from '../../response/error';
import { vWorkspacePlan } from '../workspace/plan/validator';

export const getCartPaymentCheckoutUrl = action({
	args: {
		workspaceId: v.id('workspaces'),
		currencyCode: vCurrencyCode,
		successUrl: v.string()
	},
	handler: async (ctx, args): Promise<{ checkoutUrl: string }> => {
		const userId = await authorization.userIsAuthenticated(ctx);

		const { data: checkoutUrl, error } = await paymentModel.getCartPaymentCheckoutUrl(ctx, {
			...args,
			userId
		});
		if (error) throw ServerError.InternalServerError(error.message);

		return SuccessData({ checkoutUrl });
	}
});

export const getCreditSubscriptionPaymentCheckoutUrl = action({
	args: {
		workspaceId: v.id('workspaces'),
		plan: vWorkspacePlan,
		successUrl: v.string()
	},
	handler: async (ctx, args): Promise<{ checkoutUrl: string }> => {
		const userId = await authorization.userIsAuthenticated(ctx);

		const { data: checkoutUrl, error } = await paymentModel.getCreditSubscriptionPaymentCheckoutUrl(
			ctx,
			{
				...args,
				userId
			}
		);
		if (error) throw ServerError.InternalServerError(error.message);

		return SuccessData({ checkoutUrl });
	}
});

export const getCreditOneOffPaymentCheckoutUrl = action({
	args: {
		workspaceId: v.id('workspaces'),
		price: v.number(),
		successUrl: v.string()
	},
	handler: async (ctx, args): Promise<{ checkoutUrl: string }> => {
		const userId = await authorization.userIsAuthenticated(ctx);

		const { data: checkoutUrl, error } = await paymentModel.getCreditOneOffPaymentCheckoutUrl(ctx, {
			...args,
			userId
		});
		if (error) throw ServerError.InternalServerError(error.message);

		return SuccessData({ checkoutUrl });
	}
});
