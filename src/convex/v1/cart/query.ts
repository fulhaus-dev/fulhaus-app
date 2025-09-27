import { v } from 'convex/values';
import { query } from '../../_generated/server';
import authorization from '../../middleware/authorization';
import { SuccessData } from '../../response/success';
import cartModel from './model';

export const getCartByWorkspaceId = query({
	args: {
		workspaceId: v.id('workspaces')
	},
	handler: async (ctx, args) => {
		await authorization.userIsWorkspaceMember(ctx, args.workspaceId);

		const cart = await cartModel.getCartByWorkspaceId(ctx, args.workspaceId);

		return SuccessData(cart);
	}
});
