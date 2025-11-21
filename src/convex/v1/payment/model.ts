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
import { stripeSubscriptionPlanPriceId } from './constant';
import { WorkspacePlan } from '../workspace/plan/type';

async function getCartPaymentCheckoutUrl(
	ctx: ActionCtx,
	args: {
		workspaceId: Id<'workspaces'>;
		userId: Id<'users'>;
		currencyCode: CurrencyCode;
		successUrl: string;
		cancelUrl: string;
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
		plan: 'Free',
		type: 'cart'
	};

	const totalPrice = cart.items.reduce((acc, cartItem) => {
		return acc + cartItem.product.retailPrice * (cartItem.quantity ?? 1);
	}, 0);

	const shippingAmount = Number((totalPrice * 0.05).toFixed(2));

	const { data: session, error } = await asyncTryCatch(() =>
		stripe.checkout.sessions.create({
			customer: stripeCustomerId,
			line_items: cart.items
				.filter((cartItem) => cartItem.savedForLater === 'no')
				.map((cartItem) => ({
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
			cancel_url: args.cancelUrl,
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
			metadata: paymentMetadata,
			adaptive_pricing: {
				enabled: true
			},
			automatic_tax: {
				enabled: true
			},
			shipping_options: [
				{
					shipping_rate_data: {
						type: 'fixed_amount',
						fixed_amount: {
							amount: shippingAmount * 100,
							currency: args.currencyCode.toLowerCase()
						},
						display_name: 'Shipping',
						delivery_estimate: {
							minimum: {
								unit: 'business_day',
								value: 5
							},
							maximum: {
								unit: 'business_day',
								value: 7
							}
						}
					}
				}
			]
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

async function getCreditSubscriptionPaymentCheckoutUrl(
	ctx: ActionCtx,
	args: {
		workspaceId: Id<'workspaces'>;
		userId: Id<'users'>;
		plan: WorkspacePlan;
		successUrl: string;
		cancelUrl: string;
	}
) {
	const stripeCustomerIdResponse = await stripeModel.createStripeCustomer(ctx, args.userId, 'USD');
	const { data: stripeCustomerId, error: stripeCustomerIdResponseError } = stripeCustomerIdResponse;
	if (stripeCustomerIdResponseError) return { error: stripeCustomerIdResponseError };

	const stripe = getStripeClient('USD');

	const paymentMetadata: PaymentMetadata = {
		workspaceId: args.workspaceId,
		userId: args.userId,
		plan: args.plan,
		type: 'credits',
		currencyCode: 'USD'
	};

	const { data: session, error } = await asyncTryCatch(() =>
		stripe.checkout.sessions.create({
			customer: stripeCustomerId,
			mode: 'subscription',
			line_items: [
				{
					price: stripeSubscriptionPlanPriceId[args.plan],
					quantity: 1
				}
			],
			success_url: args.successUrl,
			cancel_url: args.cancelUrl,
			customer_update: {
				shipping: 'auto'
			},
			submit_type: 'subscribe',
			subscription_data: {
				metadata: paymentMetadata
			},
			metadata: paymentMetadata,
			adaptive_pricing: {
				enabled: true
			},
			automatic_tax: {
				enabled: true
			}
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

async function getCreditOneOffPaymentCheckoutUrl(
	ctx: ActionCtx,
	args: {
		workspaceId: Id<'workspaces'>;
		userId: Id<'users'>;
		price: number;
		successUrl: string;
		cancelUrl: string;
	}
) {
	const isValidPrice = args.price > 1 && args.price % 5 === 0;
	if (!isValidPrice)
		return {
			error: {
				message: 'Invalid price',
				statusCode: httpStatusCode.BAD_REQUEST
			}
		};

	const stripeCustomerIdResponse = await stripeModel.createStripeCustomer(ctx, args.userId, 'USD');
	const { data: stripeCustomerId, error: stripeCustomerIdResponseError } = stripeCustomerIdResponse;
	if (stripeCustomerIdResponseError) return { error: stripeCustomerIdResponseError };

	const stripe = getStripeClient('USD');

	const paymentMetadata: PaymentMetadata = {
		workspaceId: args.workspaceId,
		userId: args.userId,
		plan: 'Free',
		credit: `${args.price / 0.025}`,
		type: 'credits',
		currencyCode: 'USD'
	};

	const { data: session, error } = await asyncTryCatch(() =>
		stripe.checkout.sessions.create({
			customer: stripeCustomerId,
			mode: 'payment',
			line_items: [
				{
					price: process.env.APP_BUY_CREDITS_PRICE_ID,
					quantity: args.price / 5
				}
			],
			success_url: args.successUrl,
			cancel_url: args.cancelUrl,
			customer_update: {
				shipping: 'auto'
			},
			submit_type: 'pay',
			payment_intent_data: {
				setup_future_usage: 'off_session',
				metadata: paymentMetadata
			},
			metadata: paymentMetadata,
			adaptive_pricing: {
				enabled: true
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
			custom_text: {
				submit: {
					message: `Total credits: ${args.price / 0.025}`
				}
			},
			automatic_tax: {
				enabled: true
			}
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

async function cancelSubscription(subscriptionId: string) {
	const stripe = getStripeClient('USD');

	const { data: subscription, error } = await asyncTryCatch(() =>
		stripe.subscriptions.cancel(subscriptionId)
	);

	if (error) return { error };

	return { data: subscription };
}

const paymentModel = {
	getCartPaymentCheckoutUrl,
	getCreditSubscriptionPaymentCheckoutUrl,
	getCreditOneOffPaymentCheckoutUrl,
	cancelSubscription
};
export default paymentModel;
