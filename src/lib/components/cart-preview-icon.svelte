<script lang="ts">
	import { useCartQuery } from '$lib/client/queries/use-cart.query.svelte';
	import { cn } from '$lib/utils/cn';
	import { ShoppingCartIcon } from '@lucide/svelte';

	const { class: className = '' }: { class?: string } = $props();

	const cartQuery = useCartQuery();

	const totalCartItems = $derived.by(() =>
		cartQuery.cartItems.map((cartItem) => cartItem.quantity ?? 0).reduce((a, b) => a + b, 0)
	);
</script>

<div class={cn('relative', className)}>
	<p
		class="absolute -top-1 -right-2 flex items-center justify-center rounded-full p-0.5 text-[8px] leading-none font-bold"
	>
		{totalCartItems}
	</p>
	<ShoppingCartIcon class="size-4" />
</div>
