<script lang="ts">
	import { useCart } from '$lib/client-hooks/use-cart.svelte';
	import Button from '$lib/components/button.svelte';
	import type { Id } from '../../../../convex/_generated/dataModel';
	import CartPreviewIcon from '$lib/components/cart-preview-icon.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	const workspaceId = page.data.activeWorkspaceId;

	const { productIds }: { productIds: Id<'products'>[] } = $props();

	const { cart, saveCartItems } = useCart();

	const hasCartItems = $derived(cart.cartItems.length > 0);

	function onclick() {
		if (!hasCartItems) saveCartItems(productIds.map((productId) => ({ productId, quantity: 1 })));

		if (hasCartItems) goto(`/${workspaceId}/cart`);
	}
</script>

<Button class="gap-x-4" {onclick}>
	<CartPreviewIcon />

	{#if !hasCartItems}
		<span>Add all to Cart</span>
	{/if}

	{#if hasCartItems}
		<span>View Cart</span>
	{/if}
</Button>
