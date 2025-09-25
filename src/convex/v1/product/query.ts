import { query } from '../../_generated/server';
import authorization from '../../middleware/authorization';
import { SuccessData } from '../../response/success';
import { vSpaceType } from '../design/validator';
import productModel from './model';
import { v } from 'convex/values';

export const getPoProductByPId = query({
	args: {
		poApiKey: v.string(),
		pId: v.string()
	},
	handler: async (ctx, args) => {
		authorization.authorizeProductOnboarding(args.poApiKey);

		return await productModel.getProductByPId(ctx, args.pId);
	}
});

export const getProductCategoriesForSpace = query({
	args: {
		spaceType: vSpaceType
	},
	handler: async (ctx, args) => {
		await authorization.userIsAuthenticated(ctx);

		const productCategories = productModel.getProductCategoriesForSpace(args.spaceType);

		return SuccessData(productCategories.all ?? []);
	}
});
