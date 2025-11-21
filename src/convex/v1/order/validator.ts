import { v } from 'convex/values';

export const vOrderItemStatus = v.union(
	v.literal('pending'),
	v.literal('processing'),
	v.literal('delivered'),
	v.literal('cancelled')
);

export const vCreateOrderItem = v.object({
	designId: v.id('designs'),
	productId: v.id('products'),
	price: v.float64(),
	quantity: v.number()
});
