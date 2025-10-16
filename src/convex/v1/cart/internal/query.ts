import { v } from 'convex/values';
import { internalQuery } from '../../../_generated/server';
import { vCurrencyCode } from '../../../validator';
import cartModel from '../model';

export const getCartByWorkspaceId = internalQuery({
	args: {
		workspaceId: v.id('workspaces'),
		currencyCode: vCurrencyCode
	},
	handler: async (ctx, args) =>
		await cartModel.getCartByWorkspaceId(ctx, args.workspaceId, args.currencyCode)
});
