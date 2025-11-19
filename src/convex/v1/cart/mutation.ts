import { mutation } from '../../_generated/server';
import authorization from '../../middleware/authorization';
import { v } from 'convex/values';
import { vSaveCartItem, vUpdateCartItem } from './validator';
import cartModel from './model';
import { SuccessData, SuccessMessage } from '../../response/success';

export const saveCartItems = mutation({
	args: {
		workspaceId: v.id('workspaces'),
		data: v.array(vSaveCartItem)
	},
	handler: async (ctx, args) => {
		await authorization.userIsWorkspaceMember(ctx, args.workspaceId);

		const cartItemIds = await Promise.all(
			args.data.map((data) => cartModel.saveCartItem(ctx, args.workspaceId, data))
		);

		return SuccessData({ cartItemIds });
	}
});

export const updateCartItems = mutation({
	args: {
		workspaceId: v.id('workspaces'),
		data: v.array(
			v.object({
				cartItemId: v.id('cartItems'),
				update: vUpdateCartItem
			})
		)
	},
	handler: async (ctx, args) => {
		await authorization.userIsWorkspaceMember(ctx, args.workspaceId);

		await Promise.all(
			args.data.map(({ cartItemId, update }) => cartModel.updateCartItem(ctx, cartItemId, update))
		);

		return SuccessMessage('Cart items updated');
	}
});

export const deleteCartItems = mutation({
	args: {
		workspaceId: v.id('workspaces'),
		cartItemIds: v.array(v.id('cartItems'))
	},
	handler: async (ctx, args) => {
		await authorization.userIsWorkspaceMember(ctx, args.workspaceId);

		await Promise.all(
			args.cartItemIds.map((cartItemId) => cartModel.deleteCartItem(ctx, cartItemId))
		);

		return SuccessMessage('Cart items deleted');
	}
});
