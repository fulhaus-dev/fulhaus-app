import { v } from 'convex/values';
import { internalQuery } from '../../../_generated/server';
import orderModel from '../model';

export const getOrderItemsByOid = internalQuery({
	args: {
		oid: v.string()
	},
	handler: async (ctx, args) => {
		return await orderModel.getOrderItemsByOid(ctx, args.oid);
	}
});
