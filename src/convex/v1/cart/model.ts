import { Infer } from 'convex/values';
import { Id } from '../../_generated/dataModel';
import { MutationCtx, QueryCtx } from '../../_generated/server';
import { vSaveCartItem, vSavedForLater, vUpdateCartItem } from './validator';
import productModel from '../product/model';
import { CurrencyCode } from '../../type';
import designModel from '../design/model';

async function saveCartItem(
	ctx: MutationCtx,
	workspaceId: Id<'workspaces'>,
	args: Infer<typeof vSaveCartItem>
) {
	return await ctx.db.insert('cartItems', {
		...args,
		workspaceId
	});
}

async function getCartByWorkspaceId(
	ctx: QueryCtx,
	workspaceId: Id<'workspaces'>,
	currencyCode: CurrencyCode,
	savedForLater?: Infer<typeof vSavedForLater>
) {
	const cartItems = await ctx.db
		.query('cartItems')
		.withIndex('by_workspace_currency', (q) =>
			savedForLater
				? q
						.eq('workspaceId', workspaceId)
						.eq('currencyCode', currencyCode)
						.eq('savedForLater', savedForLater)
				: q.eq('workspaceId', workspaceId).eq('currencyCode', currencyCode)
		)
		.collect();

	const uniqueCartProductIds = Array.from(new Set(cartItems.map((cartItem) => cartItem.productId)));
	const uniqueCartDesignIds = Array.from(new Set(cartItems.map((cartItem) => cartItem.designId)));

	const [products, designs] = await Promise.all([
		productModel.getProductsForClientByIds(ctx, {
			productIds: uniqueCartProductIds,
			currencyCode
		}),
		Promise.all(uniqueCartDesignIds.map((designId) => designModel.getDesignById(ctx, designId)))
	]);

	return {
		currencyCode,
		items: cartItems.map((cartItem) => ({
			...cartItem,
			product: products.find((product) => product._id === cartItem.productId)!
		})),
		designs: designs
			.filter((design) => !!design)
			.map((design) => ({
				_id: design._id,
				workspaceId: design.workspaceId,
				chatId: design.chatId,
				name: design.name
			}))
	};
}

async function getCartByDesignId(
	ctx: QueryCtx,
	workspaceId: Id<'workspaces'>,
	designId: Id<'designs'>,
	currencyCode: CurrencyCode,
	savedForLater?: Infer<typeof vSavedForLater>
) {
	const cartItems = await ctx.db
		.query('cartItems')
		.withIndex('by_workspace_design_currency', (q) =>
			savedForLater
				? q
						.eq('workspaceId', workspaceId)
						.eq('currencyCode', currencyCode)
						.eq('designId', designId)
						.eq('savedForLater', savedForLater)
				: q.eq('workspaceId', workspaceId).eq('currencyCode', currencyCode).eq('designId', designId)
		)
		.collect();

	const cartProductIds = cartItems.map((cartItem) => cartItem.productId);
	const products = await productModel.getProductsForClientByIds(ctx, {
		productIds: cartProductIds,
		currencyCode
	});

	const cartCurrencyCode = products[0]?.currencyCode ?? 'USD';

	return {
		currencyCode: cartCurrencyCode,
		items: cartItems.map((cartItem) => ({
			...cartItem,
			product: products.find((product) => product._id === cartItem.productId)!
		}))
	};
}

async function updateCartItem(
	ctx: MutationCtx,
	cartItemId: Id<'cartItems'>,
	args: Infer<typeof vUpdateCartItem>
) {
	return await ctx.db.patch(cartItemId, args);
}

async function deleteCartItem(ctx: MutationCtx, cartItemId: Id<'cartItems'>) {
	return await ctx.db.delete(cartItemId);
}

async function deleteCart(
	ctx: MutationCtx,
	workspaceId: Id<'workspaces'>,
	currencyCode: CurrencyCode
) {
	const cartItems = await ctx.db
		.query('cartItems')
		.withIndex('by_workspace_design_currency', (q) =>
			q.eq('workspaceId', workspaceId).eq('currencyCode', currencyCode)
		)
		.collect();

	await Promise.all(cartItems.map((cartItem) => ctx.db.delete(cartItem._id)));
}

const cartModel = {
	saveCartItem,
	getCartByWorkspaceId,
	getCartByDesignId,
	updateCartItem,
	deleteCartItem,
	deleteCart
};
export default cartModel;
