import { api } from '../../../convex/_generated/api.js';
import type { Id } from '../../../convex/_generated/dataModel.js';
import { page } from '$app/state';
import { useConvexQuerySubscription } from '$lib/client/convex/use-convex-query-subscription.svelte.js';
import type { CurrencyCode } from '$lib/types.js';

export function useWorkspaceCartQuery() {
	const currentWorkspaceId = page.params.workspaceId as Id<'workspaces'> | undefined;

	const { query } = useConvexQuerySubscription(
		api.v1.cart.query.getCartByWorkspaceId,
		() => ({
			workspaceId: currentWorkspaceId!,
			currencyCode: 'CAD' as CurrencyCode
		}),
		{
			requiredArgsKeys: ['workspaceId', 'currencyCode']
		}
	);

	const workspaceCartQuery = $state({
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

	return workspaceCartQuery;
}

export function useDesignCartQuery(designId: () => Id<'designs'>) {
	const currentWorkspaceId = page.params.workspaceId as Id<'workspaces'> | undefined;

	const { query } = useConvexQuerySubscription(
		api.v1.cart.query.getCartByDesignId,
		() => ({
			workspaceId: currentWorkspaceId!,
			designId: designId(),
			currencyCode: 'CAD' as CurrencyCode
		}),
		{
			requiredArgsKeys: ['workspaceId', 'designId', 'currencyCode']
		}
	);

	const designCartQuery = $state({
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

	return designCartQuery;
}
