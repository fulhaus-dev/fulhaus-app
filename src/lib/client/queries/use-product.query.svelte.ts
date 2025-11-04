import { api } from '../../../convex/_generated/api.js';
import type {
	CurrencyCode,
	Product,
	ProductCategory,
	ProductFilter,
	ProductSortOptions,
	SpaceType
} from '$lib/types.js';
import { useConvexQuerySubscription } from '$lib/client/convex/use-convex-query-subscription.svelte.js';
import { page } from '$app/state';

export function useProductCategoriesQuery() {
	const { query } = useConvexQuerySubscription(api.v1.product.query.getProductCategories, {});

	const productCategoriesQuery = $state({
		get loading() {
			return query.loading;
		},
		get error() {
			return query.error;
		},
		get categories() {
			return query.response?.categories ?? [];
		}
	});

	return productCategoriesQuery;
}

export function useProductCategoriesBySpaceQuery(spaceType: SpaceType) {
	const { query } = useConvexQuerySubscription(
		api.v1.product.query.getProductCategoriesForSpace,
		() => ({
			spaceType
		}),
		{
			requiredArgsKeys: ['spaceType']
		}
	);

	const productCategoriesBySpaceQuery = $state({
		get loading() {
			return query.loading;
		},
		get error() {
			return query.error;
		},
		get categories() {
			return query.response?.categories ?? ({} as Record<'all' | 'recommended', ProductCategory[]>);
		}
	});

	return productCategoriesBySpaceQuery;
}

export function useProductBrandsQuery(
	category: ProductCategory | undefined,
	cursor: () => string | undefined
) {
	type ProductBrandsResponse = {
		brands: string[];
		cursor: string;
		isDone: boolean;
	};

	const { query } = useConvexQuerySubscription(api.v1.product.query.getProductBrands, () => ({
		category,
		paginationOptions: {
			cursor: cursor()
		}
	}));

	const productBrandsQuery = $state({
		get loading() {
			return query.loading;
		},
		get error() {
			return query.error;
		},
		get productBrands() {
			return query.response ?? ({} as ProductBrandsResponse);
		}
	});

	return productBrandsQuery;
}

export function usePaginatedProductsByCategoryQuery(
	currencyCode: () => CurrencyCode,
	category: () => ProductCategory,
	args: {
		cursor?: () => string | undefined;
		productFilter?: () => ProductFilter | undefined;
		sortOptions?: () => ProductSortOptions | undefined;
	}
) {
	const paginatedProductsByCategoryQuery = $state({
		clientProducts: [] as Product[],
		isDone: false,
		continueCursor: undefined as string | undefined,
		loading: false,
		error: undefined as Error | undefined
	});

	let freshLoad = false;
	let lastCursor = undefined as string | undefined;

	useConvexQuerySubscription(
		api.v1.product.query.getClientProductsByCategoryWithFilters,
		() => {
			const currentCursor = args.cursor?.();

			// If cursor matches the last continueCursor, it's not a "load more"
			// so send undefined (fresh query). Otherwise send the cursor.
			const effectiveCursor = currentCursor === lastCursor ? undefined : currentCursor;
			if (effectiveCursor === undefined) freshLoad = true;

			lastCursor = effectiveCursor;

			const currentSortOptions = args.sortOptions?.();
			const effectiveSortOptions = currentSortOptions?.index?.includes('by_category')
				? { index: currentSortOptions.index, order: currentSortOptions.order }
				: undefined;

			const queryArgs = {
				currencyCode: currencyCode(),
				category: category(),
				productFilter: args.productFilter?.(),
				paginationOptions: {
					cursor: effectiveCursor,
					numItems: 25
				},
				sortOptions: effectiveSortOptions
			};

			return queryArgs;
		},
		{
			requiredArgsKeys: ['category', 'currencyCode'],
			debounceDelay: 300,
			onLoading: (loading) => {
				paginatedProductsByCategoryQuery.loading = loading;
			},
			onData: (response) => {
				if (freshLoad)
					paginatedProductsByCategoryQuery.clientProducts = response.clientProducts ?? [];
				else
					paginatedProductsByCategoryQuery.clientProducts = [
						...paginatedProductsByCategoryQuery.clientProducts,
						...(response.clientProducts ?? [])
					];

				paginatedProductsByCategoryQuery.isDone = response.isDone;
				paginatedProductsByCategoryQuery.continueCursor = response.continueCursor;

				freshLoad = false;
			},
			onError: (error) => {
				paginatedProductsByCategoryQuery.error = error;
			}
		}
	);

	return paginatedProductsByCategoryQuery;
}

export function useProductsByFullTextSearchQuery(searchText: () => string | undefined) {
	const currencyCode = page.data.currencyCode;

	const { query } = useConvexQuerySubscription(
		api.v1.product.query.getClientProductsByFullTextSearch,
		() => ({
			currencyCode,
			searchText: searchText()
		})
	);

	const productsByFullTextSearchQuery = $state({
		get loading() {
			return query.loading;
		},
		get error() {
			return query.error;
		},
		get clientProducts() {
			return query.response?.clientProducts ?? [];
		}
	});

	return productsByFullTextSearchQuery;
}
