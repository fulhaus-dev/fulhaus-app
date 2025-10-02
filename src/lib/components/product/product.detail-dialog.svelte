<script lang="ts">
	import ImageSlider from '$lib/components/image-slider.svelte';
	import type { Product } from '$lib/types';
	import number from '$lib/utils/number';
	import { XIcon } from '@lucide/svelte';
	import { Dialog } from 'bits-ui';
	import type { Snippet } from 'svelte';
	import ProductAvailabilityInfo from '$lib/components/product/product.availability-info.svelte';

	type ProductDetailDialogProps = {
		children: Snippet;
		class?: string;
		product: Product;
	};

	const { children, class: className = '', product }: ProductDetailDialogProps = $props();
</script>

<Dialog.Root>
	<Dialog.Trigger class={className}>
		{@render children()}
	</Dialog.Trigger>
	<Dialog.Portal>
		<Dialog.Overlay
			class="fixed inset-0 z-50 bg-color-overlay-background/20 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0"
		/>
		<Dialog.Content
			class="fixed top-0 right-0 z-50 h-screen w-[40rem] bg-color-background outline-hidden data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
		>
			<Dialog.Close class="absolute top-4 right-4 z-12 cursor-pointer">
				<XIcon />
			</Dialog.Close>

			<div class="relative scrollbar-thin h-full w-full overflow-y-auto pb-8">
				<div class="sticky top-0 z-10 bg-color-background p-8">
					<h5 class="text-lg font-medium">{product.name}</h5>
					<p class="mb-4 text-[10px] font-medium text-color-text-placeholder">
						{product.brand?.toUpperCase()}
					</p>

					<div class="flex items-end justify-between gap-x-4">
						<h4 class="text-4xl font-medium">
							{number.toMoney(product.retailPrice, product.currencyCode)}
						</h4>
						<ProductAvailabilityInfo
							stockQty={product.stockQty}
							restockDate={product.restockDate}
						/>
					</div>
				</div>

				<div class="relative h-[32rem] w-full bg-color-background-surface px-4 py-8">
					<ImageSlider imageUrls={product.imageUrls} productName={product.name} />

					<div class="absolute top-4 right-4 w-fit space-y-2 rounded-full p-1">
						{#each product.hexColors ?? [] as hexColor, index (`${index}-${product.name}-color-${hexColor}`)}
							<div
								class="h-6 w-6 rounded-full border border-color-border-muted"
								style="background-color: {hexColor}"
							></div>
						{/each}
					</div>
				</div>

				<div class="group p-8 text-sm">
					<p class="line-clamp-3 group-hover:line-clamp-none">{product.description}</p>
				</div>

				<div class="border-b border-color-border">
					{#if product.dimension}
						{@render ProductInformation({ label: 'DIMENSION', value: product.dimension })}
					{/if}
					{#if product.materials}
						{@render ProductInformation({
							label: product.materials.length > 1 ? 'MATERIALS' : 'MATERIAL',
							value: product.materials.map((material) => material).join(', ')
						})}
					{/if}
					{#if product.colorNames}
						{@render ProductInformation({
							label: product.colorNames.length > 1 ? 'COLORS' : 'COLOR',
							value: product.colorNames.map((colorName) => colorName).join(', ')
						})}
					{/if}
				</div>
			</div>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>

{#snippet ProductInformation({ label, value }: { label: string; value: string })}
	<div
		class="flex items-center gap-x-4 border-t border-color-border px-8 py-4 text-sm text-color-text-muted"
	>
		<h4 class="text-color-text-surface">{label}</h4>
		<p class="font-medium">{value}</p>
	</div>
{/snippet}
