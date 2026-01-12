'use node';

import Stripe from 'stripe';
import { internal } from '../../_generated/api';
import { Id } from '../../_generated/dataModel';
import { ActionCtx } from '../../_generated/server';
import { getStripeClient } from '../../config/stripe';
import { httpStatusCode } from '../../constant';
import { CurrencyCode } from '../../type';
import { asyncTryCatch } from '../../util/async';
import { Infer } from 'convex/values';
import { vStripeCustomerUpdateParams } from './validator';

async function createStripeCustomer(
	ctx: ActionCtx,
	userId: Id<'users'>,
	currencyCode: CurrencyCode
) {
	const existingStripeUser = await ctx.runQuery(
		internal.v1.user.stripe.internal.query.getStripeUser,
		{ userId, currencyCode }
	);
	if (existingStripeUser) return { data: existingStripeUser.stripeCustomerId };

	const user = await ctx.runQuery(internal.v1.user.internal.query.getUser, { userId });
	if (!user)
		return {
			error: {
				message: 'User does not exist.',
				statusCode: httpStatusCode.NOT_FOUND
			}
		};

	const stripe = getStripeClient(currencyCode);

	const { data: stripeCustomer, error } = await asyncTryCatch(() =>
		stripe.customers.create({
			email: user.email,
			name: user.fullName || 'Name Undefined'
		})
	);
	if (error) return { error };

	const stripeCustomerId = stripeCustomer.id;

	await ctx.runMutation(internal.v1.user.stripe.internal.mutation.createStripeUserById, {
		userId,
		stripeCustomerId,
		currencyCode
	});

	return { data: stripeCustomerId };
}

async function getStripeCustomer(args: { stripeCustomerId: string; currencyCode: CurrencyCode }) {
	const stripe = getStripeClient(args.currencyCode);

	const { data: existingStripeCustomer, error } = await asyncTryCatch(() =>
		stripe.customers.retrieve(args.stripeCustomerId)
	);
	if (error) return { error };

	return { data: existingStripeCustomer as Stripe.Customer };
}

async function updateStripeCustomer(
	ctx: ActionCtx,
	args: {
		userId: Id<'users'>;
		currencyCode: CurrencyCode;
		updates: Infer<typeof vStripeCustomerUpdateParams>;
	}
) {
	const { userId, currencyCode, updates = {} } = args;

	const existingStripeUser = await ctx.runQuery(
		internal.v1.user.stripe.internal.query.getStripeUser,
		{ userId, currencyCode }
	);
	if (!existingStripeUser)
		return {
			error: {
				message: 'Stripe User does not exist.',
				statusCode: httpStatusCode.NOT_FOUND
			}
		};

	const { data: existingStripeCustomer, error: existingStripeCustomerError } =
		await getStripeCustomer({
			stripeCustomerId: existingStripeUser.stripeCustomerId,
			currencyCode
		});
	if (existingStripeCustomerError) return { error: existingStripeCustomerError };

	const stripe = getStripeClient(currencyCode);

	const { data: updatedStripeCustomer, error } = await asyncTryCatch(() =>
		stripe.customers.update(existingStripeCustomer.id, {
			...updates,
			metadata: {
				...(existingStripeCustomer.metadata ?? {}),
				...(updates.metadata ?? {})
			}
		})
	);
	if (error) return { error: error };

	return { data: updatedStripeCustomer };
}

const stripeModel = {
	createStripeCustomer,
	updateStripeCustomer
};
export default stripeModel;
