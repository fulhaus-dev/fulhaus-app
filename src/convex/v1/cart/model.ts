import { Infer } from 'convex/values';
import { Id } from '../../_generated/dataModel';
import { MutationCtx, QueryCtx } from '../../_generated/server';
import { vSaveCartItem, vUpdateCartItem } from './validator';
import productModel from '../product/model';
import { CurrencyCode } from '../../type';

async function saveCartItems(
	ctx: MutationCtx,
	workspaceId: Id<'workspaces'>,
	args: Infer<typeof vSaveCartItem>[]
) {
	return await Promise.all(
		args.map((arg) =>
			ctx.db.insert('cartItems', {
				...arg,
				workspaceId
			})
		)
	);
}

async function getCartByWorkspaceId(
	ctx: QueryCtx,
	workspaceId: Id<'workspaces'>,
	currencyCode: CurrencyCode
) {
	const cartItems = await ctx.db
		.query('cartItems')
		.withIndex('by_workspace_design', (q) => q.eq('workspaceId', workspaceId))
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

async function getCartByDesignId(
	ctx: QueryCtx,
	workspaceId: Id<'workspaces'>,
	designId: Id<'designs'>,
	currencyCode: CurrencyCode
) {
	const cartItems = await ctx.db
		.query('cartItems')
		.withIndex('by_workspace_design', (q) =>
			q.eq('workspaceId', workspaceId).eq('designId', designId)
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

async function deleteCart(ctx: MutationCtx, workspaceId: Id<'workspaces'>) {
	const cartItems = await ctx.db
		.query('cartItems')
		.withIndex('by_workspace_design', (q) => q.eq('workspaceId', workspaceId))
		.collect();

	await Promise.all(cartItems.map((cartItem) => ctx.db.delete(cartItem._id)));
}

const cartModel = {
	saveCartItems,
	getCartByWorkspaceId,
	getCartByDesignId,
	updateCartItem,
	deleteCartItem,
	deleteCart
};
export default cartModel;
