import { api } from '../../../convex/_generated/api.js';
import type { SpaceType } from '$lib/types.js';
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
