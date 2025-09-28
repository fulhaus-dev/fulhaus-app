<script lang="ts">
	import Button from '$lib/components/button.svelte';
	import DesignProductSwapDialog from '$lib/components/design/design-product-swap/design-product-swap-dialog.svelte';
	import LudwigLoader from '$lib/components/loaders/ludwig-loader.svelte';
	import type { DesignProduct } from '$lib/types';
	import { cn } from '$lib/utils/cn';
	import number from '$lib/utils/number';
	import { RefreshCwIcon } from '@lucide/svelte';
	import type { Id } from '../../../convex/_generated/dataModel';
	import DesignProductCartButton from '$lib/components/design/design-product-cart-button.svelte';
	import { useDesignMutation } from '$lib/client/mutations/use-design.mutation.svelte';

	type DesignProductViewProps = {
		designId: Id<'designs'>;
		designProducts: DesignProduct[];
		generatingDesignFurnitureRecommendation: boolean;
	};

	const {
		designId,
		designProducts,
		generatingDesignFurnitureRecommendation
	}: DesignProductViewProps = $props();

	const { updateDesign } = useDesignMutation();

	function handleUpdateDesignProductSwap({
		productToSwap,
		replacementProduct
	}: {
		productToSwap: DesignProduct;
		replacementProduct: DesignProduct;
	}) {
		const replacementProductId = replacementProduct._id;
		const currentDesignProductIds = designProducts.map((p) => p._id);
		const productIdToSwapIndex = currentDesignProductIds.indexOf(productToSwap._id);

		currentDesignProductIds[productIdToSwapIndex] = replacementProductId;

		updateDesign(designId, {
			productIds: currentDesignProductIds
		});
	}
</script>

<div class="@container min-h-full w-full">
	<div
		class="grid w-full gap-2 @3xs:grid-cols-2 @5xl:grid-cols-3 @7xl:grid-cols-4 @min-[120rem]:grid-cols-5"
	>
		{#each designProducts as designProduct (designProduct._id)}
			<div
				class="relative w-full rounded-md border border-color-border-muted bg-color-background p-4"
			>
				<div
					class={cn('w-full space-y-4', generatingDesignFurnitureRecommendation && 'animate-pulse')}
				>
					<img
						class={cn(
							'h-64 w-full object-contain',
							generatingDesignFurnitureRecommendation && 'animate-pulse'
						)}
						src={designProduct.ludwigImageUrl}
						alt={designProduct.name}
					/>

					<div class="flex-1 space-y-2 text-xs font-medium">
						<div>
							<h3>{designProduct.category}</h3>
							<p class="w-full truncate hover:text-wrap">
								{designProduct.name}
							</p>
						</div>

						<h5 class="text-3xl">
							{number.toMoney(designProduct.retailPrice, designProduct.currencyCode)}
						</h5>
					</div>

					<div class="mt-8 flex items-center gap-x-4">
						<DesignProductSwapDialog
							class="w-full"
							productToSwap={designProduct}
							onSwap={(replacementProduct) =>
								handleUpdateDesignProductSwap({ productToSwap: designProduct, replacementProduct })}
						>
							<Button class="h-10" variant="outlined">
								<RefreshCwIcon />
								<span>Swap</span>
							</Button>
						</DesignProductSwapDialog>

						<DesignProductCartButton productId={designProduct._id} />
					</div>
				</div>

				{#if generatingDesignFurnitureRecommendation}
					<div
						class="absolute inset-0 z-1 flex flex-col items-center justify-center gap-y-4 rounded-md bg-color-overlay-background/20 text-sm backdrop-blur-xs"
					>
						<LudwigLoader />
						<p>Regenerating furniture recommendation...</p>
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>
