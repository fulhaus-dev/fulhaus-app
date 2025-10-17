import { v } from 'convex/values';
import { mutation } from '../../../_generated/server';
import productVendorModel from './model';
import authorization from '../../../middleware/authorization';
import { vCreateVendor } from './validator';

export const createVendor = mutation({
	args: {
		poApiKey: v.string(),
		data: vCreateVendor
	},
	handler: async (ctx, args) => {
		authorization.authorizeProductOnboarding(args.poApiKey);

		return await productVendorModel.createProductVendor(ctx, args.data);
	}
});
