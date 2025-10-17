'use node';

import Stripe from 'stripe';
import { CurrencyCode } from '../type';
import ServerError from '../response/error';

type StripeCurrencyCode = Extract<CurrencyCode, 'USD' | 'CAD'>;

const stripeClient: Record<StripeCurrencyCode, Stripe> = {
	USD: new Stripe(process.env.STRIPE_SECRET_KEY_CAD!),
	CAD: new Stripe(process.env.STRIPE_SECRET_KEY_CAD!)
};

export function getStripeClient(currencyCode: CurrencyCode) {
	if (currencyCode in stripeClient) return stripeClient[currencyCode as StripeCurrencyCode];

	throw ServerError.BadRequest(`Unsupported currency code: ${currencyCode}`);
}
