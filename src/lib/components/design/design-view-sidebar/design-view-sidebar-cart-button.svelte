<script lang="ts">
	import Button from '$lib/components/button.svelte';
	import type { Id } from '../../../../convex/_generated/dataModel';
	import CartPreviewIcon from '$lib/components/cart-preview-icon.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import number from '$lib/utils/number';
	import { useCartQuery } from '$lib/client/queries/use-cart.query.svelte';
	import { useCartMutation } from '$lib/client/mutations/use-cart.mutation.svelte';

	const workspaceId = page.data.activeWorkspaceId;

	const { productIds }: { productIds: Id<'products'>[] } = $props();

	const cartQuery = useCartQuery();
	const { saveCartItems } = useCartMutation();

	const hasCartItems = $derived(cartQuery.cartItems.length > 0);

	const totalCart = $derived.by(() =>
		cartQuery.cartItems
			.map((cartItem) => cartItem.product.retailPrice * (cartItem.quantity ?? 0))
			.reduce((a, b) => a + b, 0)
	);

	function onclick() {
		if (!hasCartItems) saveCartItems(productIds.map((productId) => ({ productId, quantity: 1 })));

		if (hasCartItems) goto(`/${workspaceId}/cart`);
	}
</script>

<div class="w-full">
	<Button class="gap-x-4" {onclick}>
		<CartPreviewIcon />

		{#if !hasCartItems}
			<span>Add all to Cart</span>
		{/if}

		{#if hasCartItems}
			<span>View Cart</span>
		{/if}
	</Button>

	{#if hasCartItems}
		<div
			class="scrollbar-thin h-[50vh] w-full overflow-y-auto rounded-md bg-color-background-surface p-8 pb-96"
		>
			{#each cartQuery.cartItems as cartItem (cartItem._id)}
				<div
					class="flex h-10 w-full items-center gap-x-2 border-t border-color-border text-sm text-color-text-muted"
				>
					<div class="flex w-full gap-x-2">
						<p class="line-clamp-1 w-5/6">{cartItem.product.name}</p>
						<p class="w-1/6 text-center">{cartItem.quantity}</p>
					</div>

					<h4 class="w-20 text-end font-medium">
						{number.toMoney(cartItem.product.retailPrice, cartQuery.cartCurrencyCode)}
					</h4>
				</div>
			{/each}

			<div
				class="flex h-10 w-full items-center justify-between gap-x-2 border-t border-color-border text-sm font-semibold"
			>
				<p>Total</p>

				<h4 class="text-end">
					{number.toMoney(totalCart, cartQuery.cartCurrencyCode)}
				</h4>
			</div>
		</div>
	{/if}
</div>
