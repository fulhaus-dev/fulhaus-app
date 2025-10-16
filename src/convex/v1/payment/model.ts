'use node';

import { internal } from '../../_generated/api';
import { Id } from '../../_generated/dataModel';
import { ActionCtx } from '../../_generated/server';
import { getStripeClient } from '../../config/stripe';
import { httpStatusCode } from '../../constant';
import { CurrencyCode } from '../../type';
import { asyncTryCatch } from '../../util/async';
import stripeModel from './stripe';
import { PaymentMetadata } from './type';

async function getCartPaymentCheckoutUrl(
	ctx: ActionCtx,
	args: {
		workspaceId: Id<'workspaces'>;
		userId: Id<'users'>;
		currencyCode: CurrencyCode;
		successUrl: string;
	}
) {
	const [stripeCustomerIdResponse, cart] = await Promise.all([
		stripeModel.createStripeCustomer(ctx, args.userId, args.currencyCode),
		ctx.runQuery(internal.v1.cart.internal.query.getCartByWorkspaceId, {
			workspaceId: args.workspaceId,
			currencyCode: args.currencyCode
		})
	]);
	const { data: stripeCustomerId, error: stripeCustomerIdResponseError } = stripeCustomerIdResponse;
	if (stripeCustomerIdResponseError) return { error: stripeCustomerIdResponseError };

	const stripe = getStripeClient(args.currencyCode);

	const paymentMetadata: PaymentMetadata = {
		workspaceId: args.workspaceId,
		userId: args.userId,
		currencyCode: args.currencyCode,
		type: 'cart'
	};

	const { data: session, error } = await asyncTryCatch(() =>
		stripe.checkout.sessions.create({
			customer: stripeCustomerId,
			line_items: cart.items.map((cartItem) => ({
				price_data: {
					currency: cartItem.product.currencyCode.toLowerCase(),
					product_data: {
						name: cartItem.product.name,
						description: cartItem.product.description,
						images: cartItem.product.imageUrls
					},
					unit_amount: Math.round(cartItem.product.retailPrice * 100)
				},
				quantity: cartItem.quantity
			})),
			mode: 'payment',
			success_url: args.successUrl,
			billing_address_collection: 'required',
			shipping_address_collection: {
				allowed_countries: [args.currencyCode === 'USD' ? 'US' : 'CA']
			},

			invoice_creation: {
				enabled: true,
				invoice_data: {
					metadata: paymentMetadata,
					issuer: {
						type: 'self'
					}
				}
			},
			payment_intent_data: {
				setup_future_usage: 'off_session',
				metadata: paymentMetadata
			},
			customer_update: {
				shipping: 'auto'
			},
			submit_type: 'pay',
			metadata: paymentMetadata
		})
	);

	if (error) return { error };
	if (!session.url)
		return {
			error: {
				message: 'Checkout failed',
				statusCode: httpStatusCode.INTERNAL_SERVER_ERROR
			}
		};

	return { data: session.url };
}

const paymentModel = {
	getCartPaymentCheckoutUrl
};
export default paymentModel;
