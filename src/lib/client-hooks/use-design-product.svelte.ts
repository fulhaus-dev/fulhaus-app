import { api } from '../../convex/_generated/api.js';
import { useConvexClient } from '$lib/client-hooks/convex.client.svelte.js';
import type { ProductCategories, SpaceType } from '$lib/types.js';
import { onMount } from 'svelte';
import { asyncTryCatch } from '$lib/utils/try-catch.js';

export function useDesignProduct(spaceType: SpaceType) {
	const convexClient = useConvexClient();

	const state = $state({
		spaceProductCategories: [] as ProductCategories
	});

	onMount(async () => {
		const { data: response } = await asyncTryCatch(() =>
			convexClient.query(api.v1.design.product.query.getProductCategoriesForSpace, {
				spaceType
			})
		);

		state.spaceProductCategories = response?.data ?? [];
	});

	return {
		designProduct: state
	};
}
