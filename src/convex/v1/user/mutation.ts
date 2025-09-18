import { mutation } from '../../_generated/server';
import { vUpdateUserValidator } from './validator';
import userModel from './model';
import authorization from '../../middleware/authorization';

export const updateUserById = mutation({
	args: {
		updates: vUpdateUserValidator
	},
	handler: async (ctx, { updates }) => {
		const userId = await authorization.userIsAuthenticated(ctx);

		return await userModel.updateUserById(ctx, { userId, updates });
	}
});
