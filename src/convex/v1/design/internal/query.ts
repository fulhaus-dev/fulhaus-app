import { v } from 'convex/values';
import { internalMutation, internalQuery } from '../../../_generated/server';
import designModel from '../model';
import { vUpdateDesign } from '../validator';

export const getDesignById = internalQuery({
	args: {
		designId: v.id('designs')
	},
	handler: async (ctx, args) => await designModel.getDesignById(ctx, args.designId)
});

export const updateDesignById = internalMutation({
	args: {
		designId: v.id('designs'),
		userId: v.id('users'),
		updates: vUpdateDesign
	},
	handler: async (ctx, args) =>
		await designModel.updateDesignById(ctx, args.designId, args.userId, args.updates)
});
