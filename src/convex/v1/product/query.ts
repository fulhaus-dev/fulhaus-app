import { query } from '../../_generated/server';
import authorization from '../../middleware/authorization';
import { SuccessData } from '../../response/success';
import { vSpaceType } from '../design/validator';
import productModel from './model';
import { v } from 'convex/values';
import { vProductCategory } from './validator';
import ServerError from '../../response/error';

export const getPoProductByPId = query({
	args: {
		poApiKey: v.string(),
		pId: v.string()
	},
	handler: async (ctx, args) => {
		authorization.authorizeProductOnboarding(args.poApiKey);

		const product = await productModel.getProductByPId(ctx, args.pId);
		if (!product) throw ServerError.NotFound('Product not found.');

		return SuccessData(product);
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

export const getClientProductsByCategory = query({
	args: {
		category: vProductCategory,
		cursor: v.optional(v.string())
	},
	handler: async (ctx, args) => {
		await authorization.userIsAuthenticated(ctx);

		const clientProductPaginationResult = await productModel.getClientProductsByCategory(
			ctx,
			args.category,
			args.cursor
		);

		return SuccessData(clientProductPaginationResult);
	}
});
