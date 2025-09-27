import { v } from 'convex/values';

export const vSaveCartItem = v.object({
	productId: v.id('products'),
	quantity: v.number()
});

export const vUpdateCartItem = v.object({
	productId: v.optional(v.id('products')),
	quantity: v.optional(v.number())
});
