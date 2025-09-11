import { v } from 'convex/values';
import { mutation } from '../../_generated/server';
import { updateUserValidator } from './validator';
import userModel from './model';

export const updateUserById = mutation({
	args: {
		userId: v.id('users'),
		updates: updateUserValidator
	},
	handler: async (ctx, { userId, updates }) =>
		await userModel.updateUserById(ctx, { userId, updates })
});
