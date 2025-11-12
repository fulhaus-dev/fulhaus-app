import { query } from '../../_generated/server';
import authorization from '../../middleware/authorization';
import { SuccessData } from '../../response/success';
import { vSpaceType } from '../design/validator';
import productModel from './model';
import { v } from 'convex/values';
import {
	vProductCategory,
	vProductFilter,
	vProductPaginationOptions,
	vProductSortOptions
} from './validator';
import { vCurrencyCode } from '../../validator';
import { vReturnedSuccessData } from '../../response/validator';
import { doc } from 'convex-helpers/validators';
import schema from '../../schema';

export const getPoProductBySku = query({
	args: {
		poApiKey: v.string(),
		sku: v.string()
	},
	returns: vReturnedSuccessData(v.object({ data: v.union(doc(schema, 'products'), v.null()) })),
	handler: async (ctx, args) => {
		authorization.authorizeProductOnboarding(args.poApiKey);

		const product = await productModel.getProductBySku(ctx, args.sku);

		return SuccessData({ data: product });
	}
});

export const getPoProductsBySkus = query({
	args: {
		poApiKey: v.string(),
		skus: v.array(v.string())
	},
	returns: vReturnedSuccessData(
		v.object({ products: v.array(v.union(doc(schema, 'products'), v.null())) })
	),
	handler: async (ctx, args) => {
		authorization.authorizeProductOnboarding(args.poApiKey);

		const products = await Promise.all(
			args.skus.map((sku) => productModel.getProductBySku(ctx, sku))
		);

		return SuccessData({ products });
	}
});

export const getProductCategories = query({
	handler: async (ctx) => {
		await authorization.userIsAuthenticated(ctx);

		const productCategories = productModel.getProductCategories();

		return SuccessData({ categories: productCategories ?? [] });
	}
});

export const getProductCategoriesForSpace = query({
	args: {
		spaceType: vSpaceType
	},
	handler: async (ctx, args) => {
		await authorization.userIsAuthenticated(ctx);

		const productCategories = productModel.getProductCategoriesForSpace(args.spaceType);

		return SuccessData({ categories: productCategories ?? [] });
	}
});

export const getClientProductsByFullTextSearch = query({
	args: {
		currencyCode: vCurrencyCode,
		searchText: v.optional(v.string())
	},
	handler: async (ctx, { currencyCode, searchText }) => {
		await authorization.userIsAuthenticated(ctx);

		if (!searchText) return SuccessData({ clientProducts: [] });

		const clientProducts = await productModel.getClientProductsByFullTextSearch(
			ctx,
			currencyCode,
			searchText
		);

		return SuccessData({ clientProducts });
	}
});

export const getClientProductsByCategoryWithFilters = query({
	args: {
		currencyCode: vCurrencyCode,
		category: vProductCategory,
		productFilter: v.optional(vProductFilter),
		paginationOptions: v.optional(vProductPaginationOptions),
		sortOptions: v.optional(vProductSortOptions)
	},
	handler: async (ctx, { currencyCode, ...otherArgs }) => {
		await authorization.userIsAuthenticated(ctx);

		const clientProductPaginationResult = await productModel.getClientProductsByCategoryWithFilters(
			ctx,
			currencyCode,
			otherArgs
		);

		return SuccessData(clientProductPaginationResult);
	}
});

export const getProductBrands = query({
	args: {
		category: v.optional(vProductCategory),
		paginationOptions: v.optional(vProductPaginationOptions)
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
