import { v } from 'convex/values';
import { mutation } from '../../../_generated/server';
import authorization from '../../../middleware/authorization';
import productErrorModel from './model';
import { SuccessMessage } from '../../../response/success';
import { vReturnedSuccessMessage } from '../../../response/validator';

export const logPoProductError = mutation({
	args: {
		poApiKey: v.string(),
		data: v.object({
			message: v.string(),
			details: v.optional(v.array(v.any()))
		})
	},
	returns: vReturnedSuccessMessage(),
	handler: async (ctx, args) => {
		authorization.authorizeProductOnboarding(args.poApiKey);

		await productErrorModel.logProductError(ctx, args.data);

		return SuccessMessage('Product error logged.');
	}
});
