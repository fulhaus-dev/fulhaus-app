import { api } from '../../../convex/_generated/api.js';
import type { Id } from '../../../convex/_generated/dataModel.js';
import { page } from '$app/state';
import { useConvexQuerySubscription } from '$lib/client/convex/use-convex-query-subscription.svelte.js';
import type { CartSavedForLater } from '$lib/types.js';

export function useWorkspaceCartQuery(savedForLater?: () => CartSavedForLater) {
	const currentWorkspaceId = page.params.workspaceId as Id<'workspaces'> | undefined;
	const currencyCode = page.data.currencyCode;

	const { query } = useConvexQuerySubscription(
		api.v1.cart.query.getCartByWorkspaceId,
		() => ({
			workspaceId: currentWorkspaceId!,
			currencyCode,
			savedForLater: savedForLater?.()
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
			return query.response?.currencyCode ?? currencyCode;
		},
		get cartItems() {
			return query.response?.items ?? [];
		}
	});

	return workspaceCartQuery;
}

export function useDesignCartQuery(
	designId: () => Id<'designs'>,
	savedForLater?: () => CartSavedForLater
) {
	const currentWorkspaceId = page.params.workspaceId as Id<'workspaces'> | undefined;
	const currencyCode = page.data.currencyCode;

	const { query } = useConvexQuerySubscription(
		api.v1.cart.query.getCartByDesignId,
		() => ({
			workspaceId: currentWorkspaceId!,
			designId: designId(),
			currencyCode,
			savedForLater: savedForLater?.()
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
			return query.response?.currencyCode ?? currencyCode;
		},
		get cartItems() {
			return query.response?.items ?? [];
		}
	});

	return designCartQuery;
}
