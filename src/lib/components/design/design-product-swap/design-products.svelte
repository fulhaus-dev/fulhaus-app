<script lang="ts">
	import { useConvexQuerySubscription } from '$lib/client-hooks/convex.client.svelte';
	import Button from '$lib/components/button.svelte';
	import RingLoader from '$lib/components/loaders/ring-loader.svelte';
	import type { DesignProduct, ProductCategory } from '$lib/types';
	import { cn } from '$lib/utils/cn';
	import number from '$lib/utils/number';
	import { api } from '../../../../convex/_generated/api';

	let getProductsByCategoryPaginationCursor = $state<string>();

	type DesignProductsProps = {
		productToSwapCategory: ProductCategory;
		onSelectProduct: (product: DesignProduct) => void;
	};

	const { productToSwapCategory, onSelectProduct }: DesignProductsProps = $props();

	const { query } = useConvexQuerySubscription(
		api.v1.product.query.getClientProductsByCategory,
		() => ({
			cursor: getProductsByCategoryPaginationCursor,
			category: productToSwapCategory
		}),
		{
			requiredArgsKeys: ['category']
		}
	);

	const loadingProductsByCategory = $derived(query.loading);
	const productsByCategory = $derived(query.response?.data.clientProducts ?? []);
	const getClientProductsByCategoryPaginationContinueCursor = $derived(
		query.response?.data.continueCursor
	);
</script>

<div class="grid w-full grid-cols-3 gap-x-2 gap-y-12">
	{#each productsByCategory as product (product._id)}
		<div class="w-full space-y-2">
			<button
				class="group relative h-40 w-full cursor-pointer"
				type="button"
				onclick={() => onSelectProduct(product)}
			>
				<img
					class="h-full w-full rounded-md border border-color-border object-contain p-1 group-hover:border-color-action-border"
					src={product.ludwigImageUrl}
					alt={product.name}
				/>

				<p
					class="absolute top-2 right-2 z-1 rounded-full bg-color-action-background px-2 py-px text-xs font-semibold text-color-action-text opacity-0 transition-all duration-500 ease-in-out group-hover:opacity-100"
				>
					Select
				</p>
			</button>

			<div class="space-y-4 px-2">
				<div>
					<p class="truncate text-xs font-medium hover:text-wrap">{product.name}</p>
					<h4 class="font-semibold">
						{number.toMoney(product.retailPrice, product.currencyCode)}
					</h4>
				</div>

				<div
					class={cn(
						'flex items-center justify-between gap-x-4 text-[10px]',
						product.stockQty < 1 && !!product.restockDate && 'items-start'
					)}
				>
					{@render AvailabilityInfo({
						stockQty: product.stockQty,
						restockDate: product.restockDate
					})}
					<Button class="font-medium underline underline-offset-2" variant="text">Details</Button>
				</div>
			</div>
		</div>
	{/each}
</div>

{#if loadingProductsByCategory}
	<RingLoader class="mx-auto" />
{/if}

{#snippet AvailabilityInfo({ stockQty, restockDate }: { stockQty: number; restockDate?: number })}
	<div>
		<p
			class={cn(
				'rounded-full border px-2 text-[10px] font-medium',
				stockQty < 1 && 'border-color-error-border bg-color-error-background text-color-error-text',
				stockQty > 0 &&
					'border-color-warning-border bg-color-warning-background text-color-warning-text',
				stockQty > 10 &&
					'border-color-success-border bg-color-success-background text-color-success-text'
			)}
		>
			{stockQty > 10 ? 'In stock' : stockQty > 0 ? 'Low stock' : 'Out of stock'}
		</p>

		{#if stockQty < 1 && restockDate}
			<p>{new Date(restockDate).toLocaleDateString('en-US')}</p>
		{/if}
	</div>
{/snippet}
