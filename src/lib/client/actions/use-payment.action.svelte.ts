import { api } from '../../../convex/_generated/api.js';
import type { Id } from '../../../convex/_generated/dataModel.js';
import { page } from '$app/state';
import { asyncTryCatch } from '$lib/utils/try-catch.js';
import { useConvexClient } from '$lib/client/convex/use-convex-client.svelte.js';

export function usePaymentAction() {
	const convexClient = useConvexClient();
	const currentWorkspaceId = page.params.workspaceId as Id<'workspaces'> | undefined;

	const state = $state({
		loading: false,
		error: undefined as string | undefined
	});

	async function handleCartCheckout() {
		if (!currentWorkspaceId) return;

		state.error = undefined;
		state.loading = true;

		const { data: response, error } = await asyncTryCatch(() =>
			convexClient.action(api.v1.payment.action.getCartPaymentCheckoutUrl, {
				workspaceId: currentWorkspaceId,
				currencyCode: 'CAD',
				successUrl: `${window.location.origin}/payment/success`
			})
		);

		if (error) {
			state.error = error.message;
			state.loading = false;
			return;
		}

		window.location.href = response.data.checkoutUrl;
	}

	return {
		paymentActionState: state,
		handleCartCheckout
	};
}
