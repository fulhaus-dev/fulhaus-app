<script lang="ts">
	import Button from '$lib/components/button.svelte';
	import { CircleMinusIcon, CirclePlusIcon, Icon } from '@lucide/svelte';
	import type { Id } from '../../../convex/_generated/dataModel';
	import type { CartItemQuantityChangeType } from '$lib/types';
	import { useCartMutation } from '$lib/client/mutations/use-cart.mutation.svelte';
	import { useDesignCartQuery } from '$lib/client/queries/use-cart.query.svelte';

	const { designId, productId }: { designId: Id<'designs'>; productId: Id<'products'> } = $props();

	const designCartQuery = useDesignCartQuery(() => designId);
	const { saveCartItems, updateCartItems, deleteCartItems } = useCartMutation();

	const currentProductCartItem = $derived.by(() =>
		designCartQuery.cartItems.find((cartItem) => cartItem.productId === productId)
	);

	const currentProductCartItemDisplay = $derived.by(() =>
		currentProductCartItem?.savedForLater === 'yes' ? undefined : currentProductCartItem
	);

	const cartProductQty = $derived(currentProductCartItem?.quantity ?? 0);

	function onCartQuantityChange(cartItemQuantityChangeType: CartItemQuantityChangeType) {
		let timeoutId: ReturnType<typeof setTimeout> | undefined = undefined;
		if (timeoutId) clearTimeout(timeoutId);

		timeoutId = setTimeout(() => {
			if (cartItemQuantityChangeType === 'decrement' && cartProductQty === 1) {
				deleteCartItems([currentProductCartItem?._id!]);
				return;
			}

			updateCartItems([
				{
					cartItemId: currentProductCartItem?._id!,
					update: {
						quantity:
							cartItemQuantityChangeType === 'increment' ? cartProductQty + 1 : cartProductQty - 1
					}
				}
			]);
		}, 150);
	}
</script>

{#if !currentProductCartItemDisplay}
	<Button
		class="h-10"
		onclick={() =>
			currentProductCartItem
				? updateCartItems([
						{
							cartItemId: currentProductCartItem?._id!,
							update: {
								savedForLater: 'no'
							}
						}
					])
				: saveCartItems([{ designId, productId, quantity: 1, savedForLater: 'no' }])}
	>
		Add to Cart
	</Button>
{/if}

{#if currentProductCartItemDisplay}
	<div class="flex w-full items-center gap-x-2">
		{@render CartQtyButton('decrement', CircleMinusIcon)}

		<div class="flex h-10 flex-1 items-center justify-center">
			<p class="text-center">
				{cartProductQty}
			</p>
		</div>

		{@render CartQtyButton('increment', CirclePlusIcon)}
	</div>
{/if}

{#snippet CartQtyButton(type: CartItemQuantityChangeType, CartQtyButtonIcon: typeof Icon)}
	<Button class="h-10 w-16 p-0" variant="outlined" onclick={() => onCartQuantityChange(type)}>
		<CartQtyButtonIcon class="size-6" />
	</Button>
{/snippet}
