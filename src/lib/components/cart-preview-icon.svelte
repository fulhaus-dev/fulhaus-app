<script lang="ts">
	import { useCart } from '$lib/client-hooks/use-cart.svelte';
	import { cn } from '$lib/utils/cn';
	import { ShoppingCartIcon } from '@lucide/svelte';

	const { class: className = '' }: { class?: string } = $props();

	const { cart } = useCart();

	const totalCartItems = $derived.by(() =>
		cart.cartItems.map((cartItem) => cartItem.quantity ?? 0).reduce((a, b) => a + b, 0)
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
