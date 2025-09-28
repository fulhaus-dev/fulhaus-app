import { api } from '../../../convex/_generated/api.js';
import type { Id } from '../../../convex/_generated/dataModel.js';
import { page } from '$app/state';
import { useConvexQuerySubscription } from '$lib/client/convex/use-convex-query-subscription.svelte.js';

export function useCartQuery() {
	const currentWorkspaceId = page.params.workspaceId as Id<'workspaces'> | undefined;

	const { query } = useConvexQuerySubscription(
		api.v1.cart.query.getCartByWorkspaceId,
		() => ({
			workspaceId: currentWorkspaceId!
		}),
		{
			requiredArgsKeys: ['workspaceId']
		}
	);

	const cartQuery = $state({
		get loading() {
			return query.loading;
		},
		get error() {
			return query.error;
		},
		get cartCurrencyCode() {
			return query.response?.data?.currencyCode ?? 'USD';
		},
		get cartItems() {
			return query.response?.data?.items ?? [];
		}
	});

	return cartQuery;
}
