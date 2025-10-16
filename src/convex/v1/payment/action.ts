'use node';

import { v } from 'convex/values';
import { action } from '../../_generated/server';
import { vCurrencyCode } from '../../validator';
import authorization from '../../middleware/authorization';
import paymentModel from './model';
import { SuccessData } from '../../response/success';
import ServerError from '../../response/error';
import { HttpStatusCode } from '../../type';

export const getCartPaymentCheckoutUrl = action({
	args: {
		workspaceId: v.id('workspaces'),
		currencyCode: vCurrencyCode,
		successUrl: v.string()
	},
	handler: async (
		ctx,
		args
	): Promise<{ statusCode: HttpStatusCode; data: { checkoutUrl: string } }> => {
		const userId = await authorization.userIsAuthenticated(ctx);

		const { data: checkoutUrl, error } = await paymentModel.getCartPaymentCheckoutUrl(ctx, {
			...args,
			userId
		});
		if (error) throw ServerError.InternalServerError(error.message);

		return SuccessData({ checkoutUrl });
	}
});
