import { Id } from '../../../_generated/dataModel';
import { MutationCtx, QueryCtx } from '../../../_generated/server';
import { CurrencyCode } from '../../../type';

async function getStripeUserByUserId(
	ctx: QueryCtx,
	args: { userId: Id<'users'>; currencyCode: CurrencyCode }
) {
	return await ctx.db
		.query('stripeUsers')
		.withIndex('by_user_currency', (q) =>
			q.eq('userId', args.userId).eq('currencyCode', args.currencyCode)
		)
		.first();
}

async function createStripeUser(
	ctx: MutationCtx,
	args: {
		userId: Id<'users'>;
		stripeCustomerId: string;
		currencyCode: CurrencyCode;
	}
) {
	const existingStripeUser = await getStripeUserByUserId(ctx, {
		userId: args.userId,
		currencyCode: args.currencyCode
	});
	if (existingStripeUser) return existingStripeUser._id;

	return await ctx.db.insert('stripeUsers', args);
}

const stripeUserModel = {
	getStripeUserByUserId,
	createStripeUser
};

export default stripeUserModel;
