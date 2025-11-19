import { api } from '../../../convex/_generated/api.js';
import type { Id } from '../../../convex/_generated/dataModel.js';
import { page } from '$app/state';
import { asyncTryCatch } from '$lib/utils/try-catch.js';
import { useConvexClient } from '$lib/client/convex/use-convex-client.svelte.js';
import type { CartSavedForLater } from '$lib/types.js';

export function useCartMutation() {
	const convexClient = useConvexClient();
	const currentWorkspaceId = page.params.workspaceId as Id<'workspaces'> | undefined;
	const currencyCode = page.data.currencyCode;

	const state = $state({
		error: undefined as string | undefined
	});

	async function saveCartItems(
		data: {
			designId: Id<'designs'>;
			productId: Id<'products'>;
			quantity: number;
			savedForLater: CartSavedForLater;
		}[]
	) {
		if (!currentWorkspaceId) return;

		const { error } = await asyncTryCatch(() =>
			convexClient.mutation(api.v1.cart.mutation.saveCartItems, {
				workspaceId: currentWorkspaceId,
				data: data.map((item) => ({ ...item, currencyCode }))
			})
		);

		if (error) state.error = error.message;
	}

	async function updateCartItems(
		data: {
			cartItemId: Id<'cartItems'>;
			update: { productId?: Id<'products'>; quantity?: number; savedForLater?: CartSavedForLater };
		}[]
	) {
		if (!currentWorkspaceId) return;

		const { error } = await asyncTryCatch(() =>
			convexClient.mutation(api.v1.cart.mutation.updateCartItems, {
				workspaceId: currentWorkspaceId,
				data
			})
		);

		if (error) state.error = error.message;
	}

	async function deleteCartItems(cartItemIds: Id<'cartItems'>[]) {
		if (!currentWorkspaceId) return;

		const { error } = await asyncTryCatch(() =>
			convexClient.mutation(api.v1.cart.mutation.deleteCartItems, {
				workspaceId: currentWorkspaceId,
				cartItemIds
			})
		);

		if (error) state.error = error.message;
	}

	return {
		cartMutationState: state,
		saveCartItems,
		updateCartItems,
		deleteCartItems
	};
}
