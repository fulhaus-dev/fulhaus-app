import { mutation } from '../../_generated/server';
import { vUpdateUserValidator } from './validator';
import userModel from './model';
import authorization from '../../middleware/authorization';
import { vCurrencyCode } from '../../validator';

export const updateUserById = mutation({
	args: {
		updates: vUpdateUserValidator,
		currencyCode: vCurrencyCode
	},
	handler: async (ctx, { currencyCode, updates }) => {
		const userId = await authorization.userIsAuthenticated(ctx);

		return await userModel.updateUserById(ctx, { userId, currencyCode, updates });
	}
});

export const migrateUsersToStripe = mutation({
	handler: async (ctx) => {
		return await userModel.migrateUsersToStripe(ctx);
	}
});
