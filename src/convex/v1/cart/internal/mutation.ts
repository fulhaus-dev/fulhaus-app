import { v } from 'convex/values';
import { internalMutation } from '../../../_generated/server';
import cartModel from '../model';
import { vCurrencyCode } from '../../../validator';

export const deleteCart = internalMutation({
	args: {
		workspaceId: v.id('workspaces'),
		currencyCode: vCurrencyCode
	},
	handler: async (ctx, args) => {
		return await cartModel.deleteCart(ctx, args.workspaceId, args.currencyCode);
	}
});
