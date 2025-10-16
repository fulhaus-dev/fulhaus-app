import { v } from 'convex/values';
import { internalQuery } from '../../../_generated/server';
import userModel from '../model';

export const getUser = internalQuery({
	args: {
		userId: v.id('users')
	},
	handler: async (ctx, { userId }) => userModel.getUserById(ctx, userId)
});
