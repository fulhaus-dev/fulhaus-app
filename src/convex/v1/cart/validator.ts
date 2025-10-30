import { v } from 'convex/values';
import { vCurrencyCode } from '../../validator';

export const vSaveCartItem = v.object({
	designId: v.id('designs'),
	productId: v.id('products'),
	quantity: v.number(),
	currencyCode: vCurrencyCode
});

export const vUpdateCartItem = v.object({
	productId: v.optional(v.id('products')),
	quantity: v.optional(v.number())
});
