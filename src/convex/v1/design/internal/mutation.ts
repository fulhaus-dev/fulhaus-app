import { v } from 'convex/values';
import { internalMutation } from '../../../_generated/server';
import { vCreateDesign, vUpdateDesign } from '../validator';
import designModel from '../model';

export const createDesign = internalMutation({
	args: {
		userId: v.id('users'),
		create: vCreateDesign
	},
	handler: async (ctx, args) => await designModel.createDesign(ctx, args.userId, args.create)
});

export const updateDesignById = internalMutation({
	args: {
		designId: v.id('designs'),
		userId: v.id('users'),
		update: vUpdateDesign
	},
	handler: async (ctx, args) =>
		await designModel.updateDesignById(ctx, args.designId, args.userId, args.update)
});
