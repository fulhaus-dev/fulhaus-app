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

		const cart = await ctx.runQuery(internal.v1.cart.internal.query.getCartByWorkspaceId, {
			workspaceId,
			currencyCode: args.paymentMetadata.currencyCode
		});

		const orderItemsToCreate = cart.items.map((item) => ({
			designId: item.designId,
			productId: item.productId,
			price: item.product.retailPrice,
			quantity: item.quantity
		}));

		const oid = await ctx.runMutation(internal.v1.order.internal.mutation.createOrderItems, {
			workspaceId,
			create: orderItemsToCreate
		});

		await ctx.scheduler.runAfter(0, internal.email.internal.action.sendTextEmail, {
			from: `Fülhaus Orders <${process.env.ORDERS_SENDER_EMAIL}>`,
			to: process.env.ORDERS_RECIPIENT_EMAIL!,
			subject: `[Action required] New order created. ${oid}`,
			text: `A new order has been created. The Order ID is "${oid}"`
		});

		await ctx.runMutation(internal.v1.cart.internal.mutation.deleteCart, {
			workspaceId,
			currencyCode: args.paymentMetadata.currencyCode
		});
	}
});
