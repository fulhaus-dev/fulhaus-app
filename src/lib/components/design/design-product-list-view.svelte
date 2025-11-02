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
	import Tooltip from '$lib/components/tooltip.svelte';

	type DesignProductListViewProps = {
		designId: Id<'designs'>;
		designProducts: Product[];
		generatingDesignFurnitureRecommendation: boolean;
	};

	const {
		designId,
		designProducts,
		generatingDesignFurnitureRecommendation
	}: DesignProductListViewProps = $props();

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

<div class="relative h-fit w-full overflow-x-auto pb-40">
	<table class="w-full text-left text-sm rtl:text-right">
		<!-- <thead class="bg-gray-50 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
			<tr>
				<th scope="col" class="px-6 py-3"> </th>
				<th scope="col" class="px-6 py-3"> Category </th>
				<th scope="col" class="px-6 py-3"> Color </th>
				<th scope="col" class="px-6 py-3"> Category </th>
				<th scope="col" class="px-6 py-3"> Price </th>
			</tr>
		</thead> -->
		<tbody>
			{#each designProducts as designProduct (designProduct._id)}
				<tr class="border-b border-color-border hover:bg-color-background-surface">
					<td class="px-4 py-1 font-serif text-base font-light text-nowrap whitespace-nowrap">
						{designProduct.category}
					</td>
					<td class="px-4 py-1">
						<div class="h-12 w-12">
							<img
								class="h-full w-full object-contain"
								src={designProduct.mainImageUrl}
								alt={designProduct.name}
							/>
						</div>
					</td>

					<td class="w-40 min-w-40 px-4 py-1 lg:w-auto">{designProduct.name}</td>
					<td class="px-4 py-1">
						<ProductDetailDialog product={designProduct}>
							<p
								class="cursor-pointer px-2 py-1 text-xs font-medium text-nowrap underline-offset-2 hover:underline"
							>
								View Details
							</p>
						</ProductDetailDialog>
					</td>
					<td class="px-4 py-1 text-xs text-nowrap whitespace-nowrap text-color-text-muted"
						>{designProduct.brand?.toUpperCase()}</td
					>
					<td class="px-4 py-1 text-lg font-medium">
						{number.toMoney(designProduct.retailPrice, designProduct.currencyCode)}
					</td>
					<td class="px-4 py-1">
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
					</td>
					<td class="px-4 py-1">
						<DesignProductCartButton {designId} productId={designProduct._id} />
					</td>
					<td class="px-4 py-1">
						<Tooltip content="Remove">
							<Button
								class="bg-color-error-background text-color-error-text"
								variant="text"
								onclick={() =>
									removeProductFromDesign(designId, {
										productId: designProduct._id,
										productCategory: { category: designProduct.category }
									})}
							>
								<TrashIcon class="size-3" />
							</Button>
						</Tooltip>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<ProductGridDialog
		class="relative mt-4 hidden flex-col items-center justify-center rounded-md border border-color-border-muted bg-color-background p-4 text-color-text-placeholder lg:mx-auto lg:flex"
		onSelectProduct={(product) =>
			addNewProductToDesign(designId, {
				productId: product._id,
				productCategory: { category: product.category }
			})}
	>
		<PlusIcon class="size-12 " />
		<p>Add another product</p>
	</ProductGridDialog>

	<ProductGridDialog
		class="fixed right-4 bottom-20 flex items-center justify-center rounded-full bg-color-action-background p-1 text-color-action-text lg:hidden"
		onSelectProduct={(product) =>
			addNewProductToDesign(designId, {
				productId: product._id,
				productCategory: { category: product.category }
			})}
	>
		<PlusIcon />
	</ProductGridDialog>

	{#if generatingDesignFurnitureRecommendation}
		<div
			class="absolute inset-0 z-1 flex flex-col items-center justify-center gap-y-4 rounded-md bg-color-overlay-background/20 text-sm backdrop-blur-xs"
		>
			<LudwigLoader />
			<p>Regenerating furniture recommendation...</p>
		</div>
	{/if}
</div>

<!-- <div class="@container min-h-full w-full pb-40 lg:pb-0">
	<div
		class="@4xs:grid-cols-2 grid w-full grid-cols-1 gap-2 @5xl:grid-cols-3 @7xl:grid-cols-4 @min-[120rem]:grid-cols-5"
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
							class="absolute top-1/2 left-1/2 z-1 hidden -translate-x-1/2 -translate-y-1/2 flex-col gap-y-12 group-hover:flex"
						>
							<ProductDetailDialog product={designProduct}>
								<p
									class=" cursor-pointer rounded-full bg-color-action-background px-2 py-1 text-xs font-medium text-color-action-text"
								>
									View Details
								</p>
							</ProductDetailDialog>

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
</div> -->
