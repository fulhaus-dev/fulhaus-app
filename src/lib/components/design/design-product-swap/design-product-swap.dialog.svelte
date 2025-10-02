<script lang="ts">
	import type { Product } from '$lib/types';
	import { MoveRightIcon, XIcon } from '@lucide/svelte';
	import { Dialog } from 'bits-ui';
	import type { Snippet } from 'svelte';
	import Button from '$lib/components/button.svelte';
	import DesignProductSwapProductsByCategory from '$lib/components/design/design-product-swap/design-product-swap.products-by-category.svelte';

	type DesignProductSwapDialogProps = {
		children: Snippet;
		class?: string;
		productToSwap: Product;
		onSwap: (product: Product) => void;
	};

	const {
		children,
		class: className = '',
		productToSwap,
		onSwap
	}: DesignProductSwapDialogProps = $props();

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
			class="fixed top-0 right-0 z-50 flex h-screen w-[40rem] flex-col bg-color-background outline-hidden data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
		>
			<Dialog.Close class="absolute top-4 right-4 cursor-pointer">
				<XIcon />
			</Dialog.Close>

			<div class="space-y-4 bg-color-background-surface p-8">
				<div>
					<h5 class="text-lg font-medium">{`Replace ${productToSwap.category}`}</h5>
					<p class="text-xs text-color-text-muted">
						{`Choose a product to replace your existing ${productToSwap.category}`}
					</p>
				</div>

				<div class="mx-auto flex w-fit items-center gap-x-8">
					{@render ProductPreview({ src: productToSwap.ludwigImageUrl, alt: productToSwap.name })}
					<MoveRightIcon />
					{@render ProductPreview({
						src: replacementProduct?.ludwigImageUrl,
						alt: replacementProduct?.name
					})}
				</div>
			</div>

			{#if isOpen}
				<DesignProductSwapProductsByCategory
					productToSwapCategory={productToSwap.category}
					onSelectProduct={(p) => (replacementProduct = p)}
				/>
			{/if}

			{#if !!replacementProduct}
				<div
					class="absolute right-0 bottom-0 left-0 z-10 flex items-center justify-end gap-x-4 border-t border-color-border-muted bg-color-background px-8 py-2 shadow shadow-color-shadow-muted"
				>
					<Button class="w-fit px-4" variant="outlined" onclick={() => (replacementProduct = null)}
						>Cancel</Button
					>
					<Button
						class="w-40"
						onclick={() => {
							onSwap(replacementProduct!);
							isOpen = false;
						}}>Replace</Button
					>
				</div>
			{/if}
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>

{#snippet ProductPreview(args: { src?: string; alt?: string })}
	<div class="flex size-16 items-center justify-center rounded-md border border-color-border p-1">
		{#if args.src && args.alt}
			<img class="h-full w-full rounded-md object-contain" src={args.src} alt={args.alt} />
		{/if}

		{#if !args.src || !args.alt}
			<p class="text-xs font-medium">Select a<br />product</p>
		{/if}
	</div>
{/snippet}
