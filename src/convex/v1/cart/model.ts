import { Infer } from 'convex/values';
import { Id } from '../../_generated/dataModel';
import { MutationCtx, QueryCtx } from '../../_generated/server';
import { vSaveCartItem, vUpdateCartItem } from './validator';
import productModel from '../product/model';

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

async function getCartByWorkspaceId(ctx: QueryCtx, workspaceId: Id<'workspaces'>) {
	const cartItems = await ctx.db
		.query('cartItems')
		.withIndex('by_workspace_design', (q) => q.eq('workspaceId', workspaceId))
		.collect();

	const cartProductIds = cartItems.map((cartItem) => cartItem.productId);
	const products = await productModel.getProductsForClientByIds(ctx, cartProductIds);

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
	designId: Id<'designs'>
) {
	const cartItems = await ctx.db
		.query('cartItems')
		.withIndex('by_workspace_design', (q) =>
			q.eq('workspaceId', workspaceId).eq('designId', designId)
		)
		.collect();

	const cartProductIds = cartItems.map((cartItem) => cartItem.productId);
	const products = await productModel.getProductsForClientByIds(ctx, cartProductIds);

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

const cartModel = {
	saveCartItems,
	getCartByWorkspaceId,
	getCartByDesignId,
	updateCartItem,
	deleteCartItem
};
export default cartModel;
