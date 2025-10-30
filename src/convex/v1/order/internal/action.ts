import { v } from 'convex/values';
import { internalAction } from '../../../_generated/server';
import { internal } from '../../../_generated/api';

export const createOrder = internalAction({
	args: {
		paymentData: v.any()
	},
	handler: async (ctx, args) => {
		const workspaceId = args.paymentData.metadata.workspaceId;
		if (!workspaceId) return;

		await ctx.runMutation(internal.v1.cart.internal.mutation.deleteCart, {
			workspaceId,
			currencyCode: args.paymentData.metadata.currencyCode
		});
	}
});
