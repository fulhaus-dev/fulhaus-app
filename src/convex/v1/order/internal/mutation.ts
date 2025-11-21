import { v } from 'convex/values';
import { internalMutation } from '../../../_generated/server';
import orderModel from '../model';
import { vCreateOrderItem } from '../validator';

export const createOrderItems = internalMutation({
	args: {
		workspaceId: v.id('workspaces'),
		create: v.array(vCreateOrderItem)
	},
	handler: async (ctx, args) => {
		return await orderModel.createOrderItems(ctx, args.workspaceId, args.create);
	}
});
