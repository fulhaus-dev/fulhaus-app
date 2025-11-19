import { v } from 'convex/values';
import { internalAction } from '../../../_generated/server';
import { internal } from '../../../_generated/api';
import { vPaymentMetadata } from '../../payment/validator';

export const createOrder = internalAction({
	args: {
		paymentData: v.any(),
		paymentMetadata: vPaymentMetadata
	},
	handler: async (ctx, args) => {
		const workspaceId = args.paymentMetadata.workspaceId;
		if (!workspaceId) return;
		if (args.paymentMetadata.type !== 'cart') return;

		await ctx.runMutation(internal.v1.cart.internal.mutation.deleteCart, {
			workspaceId,
			currencyCode: args.paymentMetadata.currencyCode
		});
	}
});
