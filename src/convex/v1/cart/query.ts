import { v } from 'convex/values';
import { query } from '../../_generated/server';
import authorization from '../../middleware/authorization';
import { SuccessData } from '../../response/success';
import cartModel from './model';
import { vCurrencyCode } from '../../validator';
import { vSavedForLater } from './validator';

export const getCartByWorkspaceId = query({
	args: {
		workspaceId: v.id('workspaces'),
		currencyCode: vCurrencyCode,
		savedForLater: v.optional(vSavedForLater)
	},
	handler: async (ctx, args) => {
		await authorization.userIsWorkspaceMember(ctx, args.workspaceId);

		const cart = await cartModel.getCartByWorkspaceId(
			ctx,
			args.workspaceId,
			args.currencyCode,
			args.savedForLater
		);

		return SuccessData(cart);
	}
});

export const getCartByDesignId = query({
	args: {
		workspaceId: v.id('workspaces'),
		designId: v.id('designs'),
		currencyCode: vCurrencyCode,
		savedForLater: v.optional(vSavedForLater)
	},
	handler: async (ctx, args) => {
		await authorization.userIsWorkspaceMember(ctx, args.workspaceId);

		const cart = await cartModel.getCartByDesignId(
			ctx,
			args.workspaceId,
			args.designId,
			args.currencyCode,
			args.savedForLater
		);

		return SuccessData(cart);
	}
});
