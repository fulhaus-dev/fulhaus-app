<script lang="ts">
	import Button from '$lib/components/button.svelte';
	import type { Id } from '../../../../convex/_generated/dataModel';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import number from '$lib/utils/number';
	import { useDesignCartQuery } from '$lib/client/queries/use-cart.query.svelte';
	import { useCartMutation } from '$lib/client/mutations/use-cart.mutation.svelte';

	type DesignViewSidebarCartButtonProps = {
		designId: Id<'designs'>;
		productIds: Id<'products'>[];
		totalDesignPrice: number;
	};

	const workspaceId = page.data.activeWorkspaceId;

	const { designId, productIds, totalDesignPrice }: DesignViewSidebarCartButtonProps = $props();

	const designCartQuery = useDesignCartQuery(() => designId);
	const { saveCartItems, updateCartItems } = useCartMutation();

	const cartItems = $derived(
		designCartQuery.cartItems.filter((cartItem) => cartItem.savedForLater === 'no')
	);

	const hasCartItems = $derived(cartItems.length > 0);

	const totalCart = $derived.by(() =>
		cartItems
			.map((cartItem) => cartItem.product.retailPrice * (cartItem.quantity ?? 0))
			.reduce((a, b) => a + b, 0)
	);

	function onclick() {
		if (hasCartItems) {
			goto(`/${workspaceId}/cart`);
			return;
		}

		const cartItemsToUpdate = designCartQuery.cartItems.filter(
			(cartItem) => cartItem.savedForLater === 'yes'
		);
		const cartProductIdsToSave = productIds.filter(
			(productId) => !cartItemsToUpdate.some((cartItem) => cartItem.productId === productId)
		);

		if (cartProductIdsToSave.length > 0)
			saveCartItems(
				cartProductIdsToSave.map((productId) => ({
					designId,
					productId,
					quantity: 1,
					savedForLater: 'no'
				}))
			);

		if (cartItemsToUpdate.length > 0)
			updateCartItems(
				cartItemsToUpdate.map((cartItem) => ({
					cartItemId: cartItem._id,
					update: { savedForLater: 'no' }
				}))
			);
	}
</script>

<div class="hidden w-full lg:block">
	<Button class="gap-x-4" {onclick}>
		{#if !hasCartItems}
			<span
				>Add all to Cart: <span>
					{number.toMoney(totalDesignPrice, designCartQuery.cartCurrencyCode)}
				</span>
			</span>
		{/if}

		{#if hasCartItems}
			<span>View Cart</span>
		{/if}
	</Button>

	{#if hasCartItems}
		<div
			class="scrollbar-thin h-[50vh] w-full overflow-y-auto rounded-md bg-color-background-surface p-8 pb-96"
		>
			{#each designCartQuery.cartItems as cartItem (cartItem._id)}
				<div
					class="flex h-10 w-full items-center gap-x-2 border-t border-color-border text-sm text-color-text-muted"
				>
					<div class="flex w-full gap-x-2">
						<p class="line-clamp-1 w-5/6">{cartItem.product.name}</p>
						<p class="w-1/6 text-center">{cartItem.quantity}</p>
					</div>

					<h4 class="w-20 text-end font-medium">
						{number.toMoney(cartItem.product.retailPrice, designCartQuery.cartCurrencyCode)}
					</h4>
				</div>
			{/each}

			<div
				class="flex h-10 w-full items-center justify-between gap-x-2 border-t border-color-border text-sm font-semibold"
			>
				<p>Total</p>

				<h4 class="text-end">
					{number.toMoney(totalCart, designCartQuery.cartCurrencyCode)}
				</h4>
			</div>
		</div>
	{/if}
</div>
