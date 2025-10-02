import { query } from '../../_generated/server';
import authorization from '../../middleware/authorization';
import { SuccessData } from '../../response/success';
import { vSpaceType } from '../design/validator';
import productModel from './model';
import { v } from 'convex/values';
import { vProductCategory, vProductFilter } from './validator';
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

export const getClientProductsWithFilters = query({
	args: {
		productFilter: v.optional(vProductFilter),
		paginationOptions: v.optional(
			v.object({ cursor: v.optional(v.string()), numItems: v.optional(v.number()) })
		),
		sortOptions: v.optional(
			v.object({
				index: v.literal('by_price'),
				order: v.union(v.literal('asc'), v.literal('desc'))
			})
		)
	},
	handler: async (ctx, args) => {
		await authorization.userIsAuthenticated(ctx);

		const clientProductPaginationResult = await productModel.getClientProductsWithFilters(
			ctx,
			args
		);

		return SuccessData(clientProductPaginationResult);
	}
});

export const getClientProductsByCategoryWithFilters = query({
	args: {
		category: vProductCategory,
		productFilter: v.optional(vProductFilter),
		paginationOptions: v.optional(
			v.object({ cursor: v.optional(v.string()), numItems: v.optional(v.number()) })
		),
		sortOptions: v.optional(
			v.object({
				index: v.literal('by_category_price'),
				order: v.union(v.literal('asc'), v.literal('desc'))
			})
		)
	},
	handler: async (ctx, { category, ...otherArgs }) => {
		await authorization.userIsAuthenticated(ctx);

		const clientProductPaginationResult = await productModel.getClientProductsByCategoryWithFilters(
			ctx,
			category,
			otherArgs
		);

		return SuccessData(clientProductPaginationResult);
	}
});

export const getProductBrands = query({
	args: {
		category: v.optional(vProductCategory),
		paginationOptions: v.optional(
			v.object({ cursor: v.optional(v.string()), numItems: v.optional(v.number()) })
		)
	},
	handler: async (ctx, args) => {
		await authorization.userIsAuthenticated(ctx);

		const productBrands = await productModel.getProductBrands(
			ctx,
			args.category,
			args.paginationOptions
		);

		return SuccessData(productBrands);
	}
});
