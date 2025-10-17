import { v } from 'convex/values';
import { internalMutation } from '../../../_generated/server';
import cartModel from '../model';

export const deleteCart = internalMutation({
	args: {
		workspaceId: v.id('workspaces')
	},
	handler: async (ctx, args) => {
		return await cartModel.deleteCart(ctx, args.workspaceId);
	}
});
