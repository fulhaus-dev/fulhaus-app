import { v } from 'convex/values';
import { mutation } from '../../_generated/server';
import { vUpdateUserValidator } from './validator';
import userModel from './model';

export const updateUserById = mutation({
	args: {
		userId: v.id('users'),
		updates: vUpdateUserValidator
	},
	handler: async (ctx, { userId, updates }) =>
		await userModel.updateUserById(ctx, { userId, updates })
});
