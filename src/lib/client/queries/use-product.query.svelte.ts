import { api } from '../../../convex/_generated/api.js';
import type { ProductCategory, SpaceType } from '$lib/types.js';
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

export function useProductBrandsByCategoryQuery(
	category: ProductCategory,
	cursor: () => string | undefined
) {
	type ProductBrandsResponse = {
		brands: string[];
		cursor: string;
		isDone: boolean;
	};

	const { query } = useConvexQuerySubscription(
		api.v1.product.query.getProductBrandsByCategory,
		() => ({
			category,
			paginationOptions: {
				cursor: cursor()
			}
		})
	);

	const productBrandsByCategoryQuery = $state({
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

	return productBrandsByCategoryQuery;
}
