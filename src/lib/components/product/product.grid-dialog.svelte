<script lang="ts">
	import type { Product } from '$lib/types';
	import { XIcon } from '@lucide/svelte';
	import { Dialog } from 'bits-ui';
	import type { Snippet } from 'svelte';
	import ProductGrid from '$lib/components/product/product.grid.svelte';

	type ProductGridDialogProps = {
		children: Snippet;
		class?: string;
		onSelectProduct: (product: Product) => void;
	};

	const { children, class: className = '', onSelectProduct }: ProductGridDialogProps = $props();

	let isOpen = $state(false);
	let replacementProduct = $state<Product | null>(null);

	function onOpenChange(open: boolean) {
		if (open) return;

		replacementProduct = null;
	}
</script>

<Dialog.Root bind:open={isOpen} {onOpenChange}>
	<Dialog.Trigger class={className}>
		{@render children()}
	</Dialog.Trigger>
	<Dialog.Portal>
		<Dialog.Overlay
			class="fixed inset-0 z-50 bg-color-overlay-background/20 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0"
		/>
		<Dialog.Content
			class="fixed top-0 right-0 z-50 flex h-screen w-screen flex-col bg-color-background outline-hidden data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 lg:w-[56rem]"
		>
			<Dialog.Close class="absolute top-4 right-4 cursor-pointer">
				<XIcon />
			</Dialog.Close>

			<div class=" bg-color-background-surface px-8 py-4">
				<h5 class="text-lg font-medium">Products</h5>
			</div>

			{#if isOpen}
				<ProductGrid
					onSelectProduct={(product) => {
						((isOpen = false), onSelectProduct(product));
					}}
				/>
			{/if}
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
