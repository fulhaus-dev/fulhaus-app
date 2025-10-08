import { api } from '../../../convex/_generated/api.js';
import type {
	Product,
	ProductCategory,
	ProductFilter,
	ProductSortOptions,
	SpaceType
} from '$lib/types.js';
import { useConvexQuerySubscription } from '$lib/client/convex/use-convex-query-subscription.svelte.js';

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
			return query.response?.data ?? [];
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
			return query.response?.data ?? ({} as ProductBrandsResponse);
		}
	});

	return productBrandsQuery;
}

export function usePaginatedProductsByCategoryQuery(
	category: ProductCategory,
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
			const effectiveSortOptions =
				currentSortOptions?.index === 'by_category_price'
					? { index: 'by_category_price' as const, order: currentSortOptions.order }
					: undefined;

			return {
				category,
				productFilter: args.productFilter?.(),
				paginationOptions: {
					cursor: effectiveCursor,
					numItems: 25
				},
				sortOptions: effectiveSortOptions
			};
		},
		{
			requiredArgsKeys: ['category'],
			debounceDelay: 300,
			onLoading: (loading) => {
				paginatedProductsByCategoryQuery.loading = loading;
			},
			onData: (response) => {
				if (freshLoad)
					paginatedProductsByCategoryQuery.clientProducts = response.data.clientProducts ?? [];
				else
					paginatedProductsByCategoryQuery.clientProducts = [
						...paginatedProductsByCategoryQuery.clientProducts,
						...(response.data.clientProducts ?? [])
					];

				paginatedProductsByCategoryQuery.isDone = response.data.isDone;
				paginatedProductsByCategoryQuery.continueCursor = response.data.continueCursor;

				freshLoad = false;
			},
			onError: (error) => {
				paginatedProductsByCategoryQuery.error = error;
			}
		}
	);

	return paginatedProductsByCategoryQuery;
}

export function useProductsQuery(args: {
	cursor: () => string | undefined;
	productFilter: () => ProductFilter | undefined;
	sortOptions?: () => ProductSortOptions | undefined;
}) {
	const productsQuery = $state({
		clientProducts: [] as Product[],
		isDone: false,
		continueCursor: undefined as string | undefined,
		loading: false,
		error: undefined as Error | undefined
	});

	let freshLoad = false;
	let lastCursor = undefined as string | undefined;

	useConvexQuerySubscription(
		api.v1.product.query.getClientProductsWithFilters,
		() => {
			const currentCursor = args.cursor();

			// If cursor matches the last continueCursor, it's not a "load more"
			// so send undefined (fresh query). Otherwise send the cursor.
			const effectiveCursor = currentCursor === lastCursor ? undefined : currentCursor;
			if (effectiveCursor === undefined) freshLoad = true;

			lastCursor = effectiveCursor;

			const currentSortOptions = args.sortOptions?.();

			const effectiveSortOptions =
				currentSortOptions?.index === 'by_price'
					? { index: 'by_price' as const, order: currentSortOptions.order }
					: undefined;

			return {
				productFilter: args.productFilter(),
				paginationOptions: {
					cursor: effectiveCursor,
					numItems: 25
				},
				sortOptions: effectiveSortOptions
			};
		},
		{
			debounceDelay: 300,
			onLoading: (loading) => {
				productsQuery.loading = loading;
			},
			onData: (response) => {
				if (freshLoad) productsQuery.clientProducts = response.data.clientProducts ?? [];
				else
					productsQuery.clientProducts = [
						...productsQuery.clientProducts,
						...(response.data.clientProducts ?? [])
					];

				productsQuery.isDone = response.data.isDone;
				productsQuery.continueCursor = response.data.continueCursor;

				freshLoad = false;
			},
			onError: (error) => {
				productsQuery.error = error;
			}
		}
	);

	return productsQuery;
}
