import { query } from '../../_generated/server';
import userModel from './model';
import { SuccessData } from '../../response/success';
import ServerError from '../../response/error';
import authorization from '../../middleware/authorization';

export const getUser = query({
	handler: async (ctx) => {
		const userId = await authorization.userIsAuthenticated(ctx);

		const user = await userModel.getUserById(ctx, userId);
		if (!user) throw ServerError.NotFound('User does not exist.');

		return SuccessData(user);
	}
});
