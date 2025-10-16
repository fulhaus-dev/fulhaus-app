'use node';

import { internal } from '../../_generated/api';
import { Id } from '../../_generated/dataModel';
import { ActionCtx } from '../../_generated/server';
import { getStripeClient } from '../../config/stripe';
import { httpStatusCode } from '../../constant';
import { CurrencyCode } from '../../type';
import { asyncTryCatch } from '../../util/async';

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
			name: user.fullName
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

const stripeModel = {
	createStripeCustomer
};
export default stripeModel;
