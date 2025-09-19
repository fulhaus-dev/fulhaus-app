import { v } from 'convex/values';
import { internalQuery } from '../../../_generated/server';
import designModel from '../model';

export const getDesignById = internalQuery({
	args: {
		designId: v.id('designs')
	},
	handler: async (ctx, args) => await designModel.getDesignById(ctx, args.designId)
});
