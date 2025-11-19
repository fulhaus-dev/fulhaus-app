<script lang="ts">
	import Button from '$lib/components/button.svelte';
	import DesignProductSwapDialog from '$lib/components/design/design-product-swap/design-product-swap.dialog.svelte';
	import LudwigLoader from '$lib/components/loaders/ludwig-loader.svelte';
	import type { Product } from '$lib/types';
	import { cn } from '$lib/utils/cn';
	import number from '$lib/utils/number';
	import { PlusIcon, RefreshCwIcon, TrashIcon } from '@lucide/svelte';
	import type { Id } from '../../../convex/_generated/dataModel';
	import DesignProductCartButton from '$lib/components/design/design-product-cart-button.svelte';
	import { useDesignMutation } from '$lib/client/mutations/use-design.mutation.svelte';
	import ProductDetailDialog from '$lib/components/product/product.detail-dialog.svelte';
	import ProductGridDialog from '$lib/components/product/product.grid-dialog.svelte';
	import CartSaveForLaterButton from '$lib/components/cart/cart-save-for-later-button.svelte';

	type DesignProductGridViewProps = {
		designId: Id<'designs'>;
		designProducts: Product[];
		generatingDesignFurnitureRecommendation: boolean;
	};

	const {
		designId,
		designProducts,
		generatingDesignFurnitureRecommendation
	}: DesignProductGridViewProps = $props();

	const { updateDesign, addNewProductToDesign, removeProductFromDesign } = useDesignMutation();

	function handleUpdateDesignProductSwap({
		productToSwap,
		replacementProduct
	}: {
		productToSwap: Product;
		replacementProduct: Product;
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

<div class="@container min-h-full w-full pb-40 lg:pb-0">
	<div
		class="grid w-full grid-cols-1 gap-2 lg:@3xs:grid-cols-2 lg:@5xl:grid-cols-3 lg:@7xl:grid-cols-4 lg:@min-[120rem]:grid-cols-5"
	>
		{#each designProducts as designProduct (designProduct._id)}
			<div
				class="relative w-full rounded-md border border-color-border-muted bg-color-background p-4"
			>
				<div
					class={cn('w-full space-y-4', generatingDesignFurnitureRecommendation && 'animate-pulse')}
				>
					<div class="group relative">
						<img
							class={cn(
								'h-64 w-full object-contain group-hover:opacity-50',
								generatingDesignFurnitureRecommendation && 'animate-pulse'
							)}
							src={designProduct.mainImageUrl}
							alt={designProduct.name}
						/>

						<div
							class="absolute inset-0 flex flex-row items-end justify-center gap-x-4 pb-4 lg:hidden lg:flex-col lg:items-center lg:gap-x-0 lg:gap-y-12 lg:pb-0 lg:group-hover:flex"
						>
							<div class="flex w-fit items-center justify-center gap-x-4 lg:gap-x-2">
								<CartSaveForLaterButton {designId} productId={designProduct._id} />

								<ProductDetailDialog product={designProduct}>
									<p
										class=" cursor-pointer rounded-full bg-color-action-background px-2 py-1 text-xs font-medium text-nowrap text-color-action-text"
									>
										View Details
									</p>
								</ProductDetailDialog>
							</div>

							<Button
								class="gap-x-1 rounded-full border border-color-error-border bg-color-error-background px-2 py-1 text-xs text-color-error-text"
								variant="text"
								onclick={() =>
									removeProductFromDesign(designId, {
										productId: designProduct._id,
										productCategory: { category: designProduct.category }
									})}
							>
								<TrashIcon class="size-3" />
								<span>Remove</span>
							</Button>
						</div>
					</div>

					<div class="flex-1 space-y-2 text-xs font-medium">
						<div>
							<h3>{designProduct.category}</h3>
							<p class="w-full truncate hover:text-wrap">
								{designProduct.name}
							</p>
							<p class="text-[10px] text-color-text-placeholder">
								{designProduct.brand?.toUpperCase()}
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

						<DesignProductCartButton {designId} productId={designProduct._id} />
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

		<ProductGridDialog
			class="relative flex h-full min-h-80 w-full flex-col items-center justify-center rounded-md border border-color-border-muted bg-color-background p-4 text-color-text-placeholder"
			onSelectProduct={(product) =>
				addNewProductToDesign(designId, {
					productId: product._id,
					productCategory: { category: product.category }
				})}
		>
			<PlusIcon class="size-12 " />
			<p>Add another product</p>
		</ProductGridDialog>
	</div>
</div>
