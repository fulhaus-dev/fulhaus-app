<script lang="ts">
	import { useConvexQuerySubscription } from '$lib/client/convex/use-convex-query-subscription.svelte';
	import Button from '$lib/components/button.svelte';
	import RingLoader from '$lib/components/loaders/ring-loader.svelte';
	import type { DesignProduct, ProductCategory } from '$lib/types';
	import { cn } from '$lib/utils/cn';
	import number from '$lib/utils/number';
	import { api } from '../../../../convex/_generated/api';
	import DesignProductSwapFilters from '$lib/components/design/design-product-swap/design-product-swap.filters.svelte';
	import type { ProductFilterQueryString } from '$lib/components/design/design-product-swap/design-product-swap.types';
	import { QueryParams } from '$lib/enums';
	import { parseProductFilters } from '$lib/components/design/design-product-swap/design-product-swap.utils';
	import { page } from '$app/state';
	import { SofaIcon } from '@lucide/svelte';

	let getProductsByCategoryPaginationCursor = $state<string>();

	type DesignProductsProps = {
		productToSwapCategory: ProductCategory;
		onSelectProduct: (product: DesignProduct) => void;
	};

	const { productToSwapCategory, onSelectProduct }: DesignProductsProps = $props();

	const productFilters = $derived(
		page.url.searchParams.get(QueryParams.PRODUCT_FILTERS) ?? ''
	) as ProductFilterQueryString;

	const parsedProductFilters = $derived.by(() => parseProductFilters(productFilters));

	const { query } = useConvexQuerySubscription(
		api.v1.product.query.getClientProductsByCategoryWithFilters,
		() => ({
			cursor: getProductsByCategoryPaginationCursor,
			category: productToSwapCategory,
			productFilter: parsedProductFilters
		}),
		{
			requiredArgsKeys: ['category'],
			debounceDelay: 300
		}
	);

	const productsByCategory = $derived(query.response?.data.clientProducts ?? []);
	const getClientProductsByCategoryPaginationContinueCursor = $derived(
		query.response?.data.continueCursor
	);
	const hasCursor = $derived(
		getClientProductsByCategoryPaginationContinueCursor !== undefined ||
			getProductsByCategoryPaginationCursor !== undefined
	);
	const isSameCursor = $derived(
		getClientProductsByCategoryPaginationContinueCursor === getProductsByCategoryPaginationCursor
	);
	const loadingProductsByCategory = $derived(query.loading && (!hasCursor || !isSameCursor));
	const loadingPaginatedProductsByCategory = $derived(query.loading && hasCursor && isSameCursor);
</script>

<div class="relative flex-1 overflow-y-auto pb-64">
	<div class="sticky top-0 z-4 bg-color-background-surface p-2 shadow shadow-color-shadow">
		<DesignProductSwapFilters {productToSwapCategory} />
	</div>

	{#if loadingProductsByCategory}
		<RingLoader class="mx-auto mt-8" />
	{/if}

	{#if !loadingProductsByCategory && !loadingPaginatedProductsByCategory && productsByCategory.length < 1}
		<div class="flex w-full flex-col items-center justify-center gap-y-4 px-2 pt-8 text-sm">
			<SofaIcon class="size-8 text-color-text-muted" />
			<p>No products matching your search/filter criteria</p>
		</div>
	{/if}

	<div
		class={cn(
			'hidden w-full grid-cols-3 gap-x-2 gap-y-12 px-2 pt-2',
			!loadingProductsByCategory && productsByCategory.length > 0 && 'grid'
		)}
	>
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
					<div class="space-y-2">
						<div>
							<p class="truncate text-xs font-medium hover:text-wrap">{product.name}</p>
							<p class="text-[9px] font-semibold text-color-text-placeholder">
								{product.brand?.toUpperCase()}
							</p>
						</div>
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

	{#if loadingPaginatedProductsByCategory}
		<RingLoader class="mx-auto mt-4" />
	{/if}
</div>

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
