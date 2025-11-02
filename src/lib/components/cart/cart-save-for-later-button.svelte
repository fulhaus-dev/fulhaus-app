<script lang="ts">
	import Button from '$lib/components/button.svelte';
	import type { Id } from '../../../convex/_generated/dataModel';
	import { useCartMutation } from '$lib/client/mutations/use-cart.mutation.svelte';
	import { useDesignCartQuery } from '$lib/client/queries/use-cart.query.svelte';
	import type { ComponentProps } from 'svelte';
	import { cn } from '$lib/utils/cn';
	import { SaveIcon } from '@lucide/svelte';

	type CartSaveForLaterButtonProps = {
		designId: Id<'designs'>;
		productId: Id<'products'>;
	} & Omit<ComponentProps<typeof Button>, 'onclick' | 'children'>;

	const {
		designId,
		productId,
		variant = 'text',
		class: className = '',
		...otherCartSaveForLaterButtonProps
	}: CartSaveForLaterButtonProps = $props();

	const designCartQuery = useDesignCartQuery(() => designId);
	const { saveCartItems, updateCartItems, deleteCartItems } = useCartMutation();

	const currentProductCartItem = $derived.by(() =>
		designCartQuery.cartItems.find((cartItem) => cartItem.productId === productId)
	);

	function saveForLater() {
		if (!currentProductCartItem)
			saveCartItems([{ designId, productId, quantity: 1, savedForLater: 'yes' }]);
		else if (currentProductCartItem.savedForLater === 'yes')
			deleteCartItems([currentProductCartItem?._id!]);
		else
			updateCartItems([
				{
					cartItemId: currentProductCartItem?._id!,
					update: {
						savedForLater: 'yes'
					}
				}
			]);
	}
</script>

<Button
	class={cn(
		'gap-x-1 rounded-full border border-color-border bg-color-background px-2 py-1 text-xs text-nowrap',
		currentProductCartItem?.savedForLater &&
			'hover:border-color-error-border hover:bg-color-error-background hover:text-color-error-text hover:line-through',
		className
	)}
	{variant}
	{...otherCartSaveForLaterButtonProps}
	onclick={saveForLater}
>
	<SaveIcon class="size-3" />
	<span
		>{currentProductCartItem?.savedForLater === 'yes' ? 'Saved for later' : 'Save for later'}</span
	>
</Button>
