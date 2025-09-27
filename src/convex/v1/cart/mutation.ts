import { mutation } from '../../_generated/server';
import authorization from '../../middleware/authorization';
import { v } from 'convex/values';
import { vSaveCartItem, vUpdateCartItem } from './validator';
import cartModel from './model';
import { SuccessData, SuccessMessage } from '../../response/success';

export const saveCartItem = mutation({
	args: {
		workspaceId: v.id('workspaces'),
		data: v.array(vSaveCartItem)
	},
	handler: async (ctx, args) => {
		await authorization.userIsWorkspaceMember(ctx, args.workspaceId);

		const cartItemIds = await cartModel.saveCartItems(ctx, args.workspaceId, args.data);

		return SuccessData({ cartItemIds });
	}
});

export const updateCartItem = mutation({
	args: {
		workspaceId: v.id('workspaces'),
		cartItemId: v.id('cartItems'),
		updates: vUpdateCartItem
	},
	handler: async (ctx, args) => {
		await authorization.userIsWorkspaceMember(ctx, args.workspaceId);

		await cartModel.updateCartItem(ctx, args.cartItemId, args.updates);

		return SuccessMessage('Cart item updated');
	}
});

export const deleteCartItem = mutation({
	args: {
		workspaceId: v.id('workspaces'),
		cartItemId: v.id('cartItems')
	},
	handler: async (ctx, args) => {
		await authorization.userIsWorkspaceMember(ctx, args.workspaceId);

		await cartModel.deleteCartItem(ctx, args.cartItemId);

		return SuccessMessage('Cart item deleted');
	}
});
