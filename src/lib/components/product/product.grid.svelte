<script lang="ts">
	import { useConvexQuerySubscription } from '$lib/client/convex/use-convex-query-subscription.svelte';
	import RingLoader from '$lib/components/loaders/ring-loader.svelte';
	import type { DesignProduct, ProductFilterQueryString } from '$lib/types';
	import { cn } from '$lib/utils/cn';
	import number from '$lib/utils/number';
	import ProductFilters from '$lib/components/product/product.filters.svelte';
	import { QueryParams } from '$lib/enums';
	import { parseProductFilters } from '$lib/components/product/product.utils';
	import { page } from '$app/state';
	import { SofaIcon } from '@lucide/svelte';
	import ProductDetailDialog from '$lib/components/product/product.detail-dialog.svelte';
	import ProductAvailabilityInfo from '$lib/components/product/product.availability-info.svelte';
	import { api } from '../../../convex/_generated/api';

	let getProductsPaginationCursor = $state<string>();

	type DesignProductsProps = {
		onSelectProduct: (product: DesignProduct) => void;
	};

	const { onSelectProduct }: DesignProductsProps = $props();

	const productFilters = $derived(
		page.url.searchParams.get(QueryParams.PRODUCT_FILTERS) ?? ''
	) as ProductFilterQueryString;

	const parsedProductFilters = $derived.by(() => parseProductFilters(productFilters));

	const { query } = useConvexQuerySubscription(
		api.v1.product.query.getClientProductsWithFilters,
		() => ({
			cursor: getProductsPaginationCursor,
			productFilter: parsedProductFilters
		}),
		{
			debounceDelay: 300
		}
	);

	const products = $derived(query.response?.data.clientProducts ?? []);
	const getClientProductsPaginationContinueCursor = $derived(query.response?.data.continueCursor);
	const hasCursor = $derived(
		getClientProductsPaginationContinueCursor !== undefined ||
			getProductsPaginationCursor !== undefined
	);
	const isSameCursor = $derived(
		getClientProductsPaginationContinueCursor === getProductsPaginationCursor
	);
	const loadingProducts = $derived(query.loading && (!hasCursor || !isSameCursor));
	const loadingPaginatedProducts = $derived(query.loading && hasCursor && isSameCursor);
</script>

<div class="relative flex-1 overflow-y-auto pb-64">
	<div class="sticky top-0 z-4 bg-color-background-surface p-2 shadow shadow-color-shadow">
		<ProductFilters />
	</div>

	{#if loadingProducts}
		<RingLoader class="mx-auto mt-8" />
	{/if}

	{#if !loadingProducts && !loadingPaginatedProducts && products.length < 1}
		<div class="flex w-full flex-col items-center justify-center gap-y-4 px-2 pt-8 text-sm">
			<SofaIcon class="size-8 text-color-text-muted" />
			<p>No products matching your search/filter criteria</p>
		</div>
	{/if}

	<div
		class={cn(
			'hidden w-full grid-cols-4 gap-x-2 gap-y-12 px-2 pt-2',
			!loadingProducts && products.length > 0 && 'grid'
		)}
	>
		{#each products as product (product._id)}
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
						<ProductAvailabilityInfo
							stockQty={product.stockQty}
							restockDate={product.restockDate}
						/>

						<ProductDetailDialog
							{product}
							class="cursor-pointer font-medium underline underline-offset-2"
						>
							Details
						</ProductDetailDialog>
					</div>
				</div>
			</div>
		{/each}
	</div>

	{#if loadingPaginatedProducts}
		<RingLoader class="mx-auto mt-4" />
	{/if}
</div>
