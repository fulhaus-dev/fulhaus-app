import { api } from '../../convex/_generated/api.js';
import {
	useConvexClient,
	useConvexQuerySubscription
} from '$lib/client-hooks/convex.client.svelte.js';
import type { CartItem, CurrencyCode } from '$lib/types.js';
import type { Id } from '../../convex/_generated/dataModel.js';
import { page } from '$app/state';
import { asyncTryCatch } from '$lib/utils/try-catch.js';

export function useCart() {
	const convexClient = useConvexClient();
	const currentWorkspaceId = page.params.workspaceId as Id<'workspaces'> | undefined;

	const state = $state({
		cartItems: [] as CartItem[],
		currencyCode: 'USD' as CurrencyCode,
		error: undefined as string | undefined
	});

	useConvexQuerySubscription(
		api.v1.cart.query.getCartByWorkspaceId,
		() => ({
			workspaceId: currentWorkspaceId!
		}),
		{
			requiredArgsKeys: ['workspaceId'],
			onData: (userQuery) => {
				state.cartItems = userQuery.data.items;
				state.currencyCode = userQuery.data.currencyCode;
			}
		}
	);

	async function saveCartItems(data: { productId: Id<'products'>; quantity: number }[]) {
		if (!currentWorkspaceId) return;

		const { error } = await asyncTryCatch(() =>
			convexClient.mutation(api.v1.cart.mutation.saveCartItem, {
				workspaceId: currentWorkspaceId,
				data
			})
		);

		if (error) state.error = error.message;
	}

	async function updateCartItem(
		cartItemId: Id<'cartItems'>,
		updates: { productId?: Id<'products'>; quantity?: number }
	) {
		if (!currentWorkspaceId) return;

		const { error } = await asyncTryCatch(() =>
			convexClient.mutation(api.v1.cart.mutation.updateCartItem, {
				workspaceId: currentWorkspaceId,
				cartItemId,
				updates
			})
		);

		if (error) state.error = error.message;
	}

	async function deleteCartItem(cartItemId: Id<'cartItems'>) {
		if (!currentWorkspaceId) return;

		const { error } = await asyncTryCatch(() =>
			convexClient.mutation(api.v1.cart.mutation.deleteCartItem, {
				workspaceId: currentWorkspaceId,
				cartItemId
			})
		);

		if (error) state.error = error.message;
	}

	return {
		cart: state,
		saveCartItems,
		updateCartItem,
		deleteCartItem
	};
}
