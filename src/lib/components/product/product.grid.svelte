<script lang="ts">
	import RingLoader from '$lib/components/loaders/ring-loader.svelte';
	import type {
		Product,
		ProductCategory,
		ProductFilterQueryString,
		ProductSortOptionsQueryString
	} from '$lib/types';
	import { cn } from '$lib/utils/cn';
	import number from '$lib/utils/number';
	import ProductFilters from '$lib/components/product/product.filters.svelte';
	import { QueryParams } from '$lib/enums';
	import {
		parseProductFilters,
		parseProductSortOptions
	} from '$lib/components/product/product.utils';
	import { page } from '$app/state';
	import { SofaIcon } from '@lucide/svelte';
	import ProductDetailDialog from '$lib/components/product/product.detail-dialog.svelte';
	import ProductAvailabilityInfo from '$lib/components/product/product.availability-info.svelte';
	import infiniteScroll from '$lib/dom-actions/infinite-scroll';
	import {
		usePaginatedProductsByCategoryQuery,
		useProductsByFullTextSearchQuery
	} from '$lib/client/queries/use-product.query.svelte';
	import { Debounced } from 'runed';

	type DesignProductsProps = {
		selectedProductCategory: ProductCategory;
		onSelectProduct: (product: Product) => void;
	};

	const { onSelectProduct, selectedProductCategory }: DesignProductsProps = $props();

	const currencyCode = page.data.currencyCode;

	const productFullTextSearchValue = $derived(
		page.url.searchParams.get(QueryParams.PRODUCT_FULL_TEXT_SEARCH_VALUE) ?? undefined
	);
	const debouncedProductFullTextSearchValue = new Debounced(() => productFullTextSearchValue, 1000);

	const productsByFullTextSearchQuery = useProductsByFullTextSearchQuery(
		() => debouncedProductFullTextSearchValue.current
	);
	const fullTextSearchClientProducts = $derived(productsByFullTextSearchQuery.clientProducts);
	const loadingProductsByFullTextSearch = $derived(
		debouncedProductFullTextSearchValue.pending || productsByFullTextSearchQuery.loading
	);

	const isFullTextSearchView = $derived(!!productFullTextSearchValue);

	const productFilters = $derived(
		page.url.searchParams.get(QueryParams.PRODUCT_FILTERS) ?? ''
	) as ProductFilterQueryString;
	const parsedProductFilters = $derived.by(() => parseProductFilters(productFilters));

	const productSortOptions = $derived(
		page.url.searchParams.get(QueryParams.PRODUCT_SORT_OPTIONS) ?? ''
	) as ProductSortOptionsQueryString;
	const parsedProductSortOptions = $derived.by(() => parseProductSortOptions(productSortOptions));

	let getProductsPaginationCursor = $state<string>();

	const productsQuery = usePaginatedProductsByCategoryQuery(
		() => currencyCode,
		() => selectedProductCategory,
		{
			cursor: () => getProductsPaginationCursor,
			productFilter: () => parsedProductFilters,
			sortOptions: () => parsedProductSortOptions
		}
	);

	const products = $derived(productsQuery.clientProducts);
	const hasMoreProducts = $derived(!productsQuery.isDone);
	const getProductsContinueCursor = $derived(productsQuery.continueCursor);
	const loadingPaginatedProducts = $derived(
		getProductsPaginationCursor === getProductsContinueCursor
	);
	const loadingFreshProducts = $derived(
		(productsQuery.loading || loadingProductsByFullTextSearch) && !loadingPaginatedProducts
	);

	function loadMoreProducts() {
		if (!hasMoreProducts || loadingFreshProducts || loadingPaginatedProducts) return;

		getProductsPaginationCursor = getProductsContinueCursor;
	}
</script>

<div class="relative flex-1 overflow-y-auto pb-96">
	<div class="sticky top-0 z-4 bg-color-background-surface p-2 shadow shadow-color-shadow">
		<ProductFilters
			productCategory={selectedProductCategory}
			isSwapFilters={false}
			{isFullTextSearchView}
		/>
	</div>

	{#if loadingFreshProducts}
		<RingLoader class="mx-auto mt-8" />
	{/if}

	{#if !loadingFreshProducts && !loadingPaginatedProducts && products.length < 1}
		<div class="flex w-full flex-col items-center justify-center gap-y-4 px-2 pt-8 text-sm">
			<SofaIcon class="size-8 text-color-text-muted" />
			<p>No products matching your search/filter criteria</p>
		</div>
	{/if}

	<div
		class={cn(
			'grid w-full grid-cols-2 gap-x-2 gap-y-12 px-2 pt-2 lg:grid-cols-4',
			loadingFreshProducts && 'hidden'
		)}
	>
		{#each isFullTextSearchView ? fullTextSearchClientProducts : products as product (product._id)}
			<div class="w-full space-y-2">
				<button
					class="group relative h-40 w-full cursor-pointer"
					type="button"
					onclick={() => onSelectProduct(product)}
				>
					<img
						class="h-full w-full rounded-md border border-color-border object-contain p-1 group-hover:border-color-action-border"
						src={product.mainImageUrl}
						alt={product.name}
					/>

					<p
						class="absolute top-2 right-2 z-1 rounded-full bg-color-action-background px-2 py-px text-xs font-semibold text-color-action-text transition-all duration-500 ease-in-out group-hover:opacity-100 lg:opacity-0"
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

	{#if hasMoreProducts && !loadingPaginatedProducts}
		<div
			use:infiniteScroll={{
				callback: loadMoreProducts,
				enabled: hasMoreProducts && !loadingPaginatedProducts,
				threshold: 0.1,
				rootMargin: '200px'
			}}
			class="h-px"
		></div>
	{/if}
</div>
