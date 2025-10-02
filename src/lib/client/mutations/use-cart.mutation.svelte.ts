import { api } from '../../../convex/_generated/api.js';
import type { Id } from '../../../convex/_generated/dataModel.js';
import { page } from '$app/state';
import { asyncTryCatch } from '$lib/utils/try-catch.js';
import { useConvexClient } from '$lib/client/convex/use-convex-client.svelte.js';

export function useCartMutation() {
	const convexClient = useConvexClient();
	const currentWorkspaceId = page.params.workspaceId as Id<'workspaces'> | undefined;

	const state = $state({
		error: undefined as string | undefined
	});

	async function saveCartItems(
		data: { designId: Id<'designs'>; productId: Id<'products'>; quantity: number }[]
	) {
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
		cartMutationState: state,
		saveCartItems,
		updateCartItem,
		deleteCartItem
	};
}
