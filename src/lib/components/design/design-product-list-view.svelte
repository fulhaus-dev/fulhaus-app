<script lang="ts">
	import Button from '$lib/components/button.svelte';
	import DesignProductSwapDialog from '$lib/components/design/design-product-swap/design-product-swap.dialog.svelte';
	import LudwigLoader from '$lib/components/loaders/ludwig-loader.svelte';
	import type { Product } from '$lib/types';
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

					<td class="px-4 py-1">{designProduct.name}</td>
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
