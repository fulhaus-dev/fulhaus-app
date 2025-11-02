import { v } from 'convex/values';
import { vCurrencyCode } from '../../validator';

export const vSavedForLater = v.union(v.literal('yes'), v.literal('no'));

export const vSaveCartItem = v.object({
	designId: v.id('designs'),
	productId: v.id('products'),
	quantity: v.number(),
	currencyCode: vCurrencyCode,
	savedForLater: vSavedForLater
});

export const vUpdateCartItem = v.object({
	productId: v.optional(v.id('products')),
	quantity: v.optional(v.number()),
	savedForLater: v.optional(vSavedForLater)
});
