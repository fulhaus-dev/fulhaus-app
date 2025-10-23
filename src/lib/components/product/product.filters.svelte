<script lang="ts">
	import { page } from '$app/state';
	import { useRouteMutation } from '$lib/client/mutations/use-route.mutation.svelte';
	import {
		parseProductFilters,
		parseProductSortOptions,
		stringifyProductFilters,
		stringifyProductSortOptions
	} from '$lib/components/product/product.utils';
	import TextInput from '$lib/components/text-input.svelte';
	import { QueryParams } from '$lib/enums';
	import type {
		ProductCategory,
		ProductFilterKey,
		ProductFilterQueryString,
		ProductSortOptionsQueryString
	} from '$lib/types';
	import { ArrowDownWideNarrowIcon, SearchIcon } from '@lucide/svelte';
	import Checkbox from '$lib/components/checkbox.svelte';
	import Button from '$lib/components/button.svelte';
	import { cn } from '$lib/utils/cn';
	import {
		useProductBrandsQuery,
		useProductCategoriesQuery
	} from '$lib/client/queries/use-product.query.svelte';
	import ProductFilterPopover from '$lib/components/product/product.filter-popover.svelte';
	import ProductSortFilterPopover from '$lib/components/product/product.sort-filter-popover.svelte';

	type UpdateRouteProductFilterQuery = {
		productFilterQueryString?: ProductFilterQueryString;
		productFilterKeysToRemove?: ProductFilterKey[];
	};

	type UpdateRouteProductSortOptionsQuery = {
		productSortOptionsQueryString?: ProductSortOptionsQueryString;
		removeSortOptions?: 'remove-sort-options';
	};

	type PriceFilters = {
		minPrice?: number;
		maxPrice?: number;
	};

	type DimensionFilters = {
		minWidth?: number;
		maxWidth?: number;
		minHeight?: number;
		maxHeight?: number;
		minDepth?: number;
		maxDepth?: number;
	};

	type WeightFilters = {
		minWeight?: number;
		maxWeight?: number;
	};

	const { productCategory }: { productCategory?: ProductCategory } = $props();

	const currencyCode = page.data.currencyCode;

	const { updateRouteQuery } = useRouteMutation();

	let cursor = $state<string | undefined>(undefined);
	const productCategoriesQuery = useProductCategoriesQuery();
	const productBrandsQuery = useProductBrandsQuery(productCategory, () => cursor);

	const productCategories = $derived(
		productCategoriesQuery.categories.toSorted((a, b) => a.localeCompare(b))
	);
	const productBrands = $derived(productBrandsQuery.productBrands.brands ?? []);
	const currentCursor = $derived(productBrandsQuery.productBrands.cursor);
	const hasMoreBrands = $derived(productBrandsQuery.productBrands.isDone);

	let priceFilters = $state<PriceFilters>({});
	let dimensionFilters = $state<DimensionFilters>({});
	let weightFilters = $state<WeightFilters>({});

	let openCategoryFilter = $state(false);
	let openAvailabilityFilter = $state(false);
	let openPriceFilter = $state(false);
	let openDimensionsFilter = $state(false);
	let openWeightFilter = $state(false);
	let openBrandFilter = $state(false);
	let openSortFilter = $state(false);

	const aFilterIsOpen = $derived(
		openAvailabilityFilter ||
			openPriceFilter ||
			openDimensionsFilter ||
			openWeightFilter ||
			openBrandFilter ||
			openSortFilter
	);

	const productFilters = $derived.by(
		() => page.url.searchParams.get(QueryParams.PRODUCT_FILTERS) ?? ''
	) as ProductFilterQueryString;
	const parsedProductFilters = $derived.by(() => parseProductFilters(productFilters));

	const productSortOptions = $derived.by(
		() => page.url.searchParams.get(QueryParams.PRODUCT_SORT_OPTIONS) ?? ''
	) as ProductSortOptionsQueryString;
	const parsedProductSortOptions = $derived.by(() => parseProductSortOptions(productSortOptions));

	const hasPriceFilter = $derived(
		parsedProductFilters.minPrice !== undefined || parsedProductFilters.maxPrice !== undefined
	);
	const hasDimensionsFilter = $derived(
		parsedProductFilters.minWidth !== undefined ||
			parsedProductFilters.maxWidth !== undefined ||
			parsedProductFilters.minHeight !== undefined ||
			parsedProductFilters.maxHeight !== undefined ||
			parsedProductFilters.minDepth !== undefined ||
			parsedProductFilters.maxDepth !== undefined
	);
	const hasWeightFilter = $derived(
		weightFilters.minWeight !== undefined || weightFilters.maxWeight !== undefined
	);
	const hasBrandFilter = $derived(parsedProductFilters.brand !== undefined);

	const hasSortFilter = $derived(parsedProductSortOptions !== undefined);

	function updateRouteProductFilterQuery({
		productFilterQueryString,
		productFilterKeysToRemove
	}: UpdateRouteProductFilterQuery) {
		if (!productFilterQueryString && !productFilterKeysToRemove) return;

		let currentProductFilters = { ...parsedProductFilters };

		// Remove filters first if specified
		if (productFilterKeysToRemove) {
			const removedQueryFilterKeys = productFilterKeysToRemove.reduce(
				(acc, key) => {
					acc[key] = undefined;
					return acc;
				},
				{} as Record<ProductFilterKey, undefined>
			);

			currentProductFilters = { ...currentProductFilters, ...removedQueryFilterKeys };
		}

		// Add/update filters if specified
		if (productFilterQueryString) {
			const newProductFilters = parseProductFilters(productFilterQueryString);
			currentProductFilters = { ...currentProductFilters, ...newProductFilters };
		}

		// If no filters remain after operations, remove the query param entirely
		if (Object.values(currentProductFilters).filter((value) => value !== undefined).length < 1) {
			updateRouteQuery({
				queryKeysToRemove: [QueryParams.PRODUCT_FILTERS],
				options: { keepFocus: true }
			});
			return;
		}

		// Update route with the new filter string
		updateRouteQuery({
			queryString: `${QueryParams.PRODUCT_FILTERS}=${stringifyProductFilters(currentProductFilters)}`,
			options: { keepFocus: true }
		});
	}

	function updateRouteProductSortFilterQuery({
		productSortOptionsQueryString,
		removeSortOptions
	}: UpdateRouteProductSortOptionsQuery) {
		if (!productSortOptionsQueryString && !removeSortOptions) return;

		if (removeSortOptions) {
			updateRouteQuery({
				queryKeysToRemove: [QueryParams.PRODUCT_SORT_OPTIONS],
				options: { keepFocus: true }
			});
			return;
		}

		if (productSortOptionsQueryString) {
			const newProductSortOptions = parseProductSortOptions(productSortOptionsQueryString);

			if (newProductSortOptions)
				updateRouteQuery({
					queryString: `${QueryParams.PRODUCT_SORT_OPTIONS}=${stringifyProductSortOptions(newProductSortOptions)}`,
					options: { keepFocus: true }
				});
		}
	}

	function clearFilters() {
		priceFilters = {};
		dimensionFilters = {};
		weightFilters = {};

		updateRouteQuery({
			queryKeysToRemove: [QueryParams.PRODUCT_FILTERS, QueryParams.PRODUCT_SORT_OPTIONS],
			options: { keepFocus: true }
		});
	}
</script>

<div class="space-y-1">
	<div class="relative">
		<SearchIcon class="absolute top-1/2 left-2 size-4 -translate-y-1/2 text-color-text-muted" />
		<TextInput
			class="h-10 bg-color-background pl-8"
			type="search"
			placeholder={`Search for ${productCategory}s by name`}
			defaultValue={parsedProductFilters.name}
			oninput={(e) => {
				const searchValue = e.currentTarget.value;

				if (searchValue)
					updateRouteProductFilterQuery({
						productFilterQueryString: `name-${searchValue}`
					});
				else
					updateRouteProductFilterQuery({
						productFilterKeysToRemove: ['name']
					});
			}}
		/>
	</div>

	<div class="flex w-full items-center justify-between">
		<div class="flex w-full items-center gap-x-1">
			{#if !productCategory}
				{@render CategoryFilter()}
			{/if}

			{@render AvailabilityFilter()}
			{@render PriceFilter()}
			{@render DimensionFilter()}
			{@render WeightFilter()}

			{#if productBrands.length > 0}
				{@render BrandFilter()}
			{/if}

			<Button
				class={cn('ml-4 text-xs font-medium text-color-text-muted', aFilterIsOpen && 'opacity-20')}
				variant="text"
				onclick={clearFilters}>Clear filters</Button
			>
		</div>

		{@render SortFilter()}
	</div>
</div>

{#snippet CategoryFilter()}
	<ProductFilterPopover
		triggerLabel="Category"
		hasFilter={!!parsedProductFilters.category}
		bind:open={openCategoryFilter}
		{aFilterIsOpen}
	>
		<div class="scrollbar-thin max-h-96 space-y-4 overflow-y-auto p-4">
			{#each productCategories as productCategory, index (`${index}-${productCategory}`)}
				{@render CheckBoxFilter({
					id: `${index}-${productCategory}`,
					label: productCategory,
					checked: parsedProductFilters.category === productCategory,
					onchange: (checked) => {
						openCategoryFilter = false;

						if (checked)
							updateRouteProductFilterQuery({
								productFilterQueryString: `category-${productCategory}`
							});
						else
							updateRouteProductFilterQuery({
								productFilterKeysToRemove: ['category']
							});
					}
				})}
			{/each}
		</div>
	</ProductFilterPopover>
{/snippet}

{#snippet AvailabilityFilter()}
	<ProductFilterPopover
		triggerLabel="Availability"
		hasFilter={!!parsedProductFilters.availability}
		bind:open={openAvailabilityFilter}
		{aFilterIsOpen}
	>
		<div class="space-y-4 p-4">
			{@render CheckBoxFilter({
				id: 'in-stock',
				label: 'In stock',
				checked: parsedProductFilters.availability === 'In Stock',
				onchange: (checked) => {
					openAvailabilityFilter = false;

					if (checked)
						updateRouteProductFilterQuery({
							productFilterQueryString: 'availability-In Stock'
						});
					else
						updateRouteProductFilterQuery({
							productFilterKeysToRemove: ['availability']
						});
				}
			})}

			{@render CheckBoxFilter({
				id: 'low-stock',
				label: 'Low stock',
				checked: parsedProductFilters.availability === 'Low Stock',
				onchange: (checked) => {
					openAvailabilityFilter = false;

					if (checked)
						updateRouteProductFilterQuery({
							productFilterQueryString: 'availability-Low Stock'
						});
					else
						updateRouteProductFilterQuery({
							productFilterKeysToRemove: ['availability']
						});
				}
			})}

			{@render CheckBoxFilter({
				id: 'out-of-stock',
				label: 'Out of stock',
				checked: parsedProductFilters.availability === 'Out of Stock',
				onchange: (checked) => {
					openAvailabilityFilter = false;

					if (checked)
						updateRouteProductFilterQuery({
							productFilterQueryString: 'availability-Out of Stock'
						});
					else
						updateRouteProductFilterQuery({
							productFilterKeysToRemove: ['availability']
						});
				}
			})}
		</div>
	</ProductFilterPopover>
{/snippet}

{#snippet PriceFilter()}
	<ProductFilterPopover
		triggerLabel="Price"
		hasFilter={hasPriceFilter}
		bind:open={openPriceFilter}
		{aFilterIsOpen}
	>
		<div class="flex items-center gap-x-4 border-b border-color-border p-4">
			{@render MinMaxFilterTextInput({
				type: 'Min',
				metric: currencyCode,
				name: 'minPrice',
				defaultValue: parsedProductFilters.minPrice,
				bindableValueKey: 'minPrice',
				filters: priceFilters
			})}
			{@render MinMaxFilterTextInput({
				type: 'Max',
				metric: currencyCode,
				name: 'maxPrice',
				defaultValue: parsedProductFilters.maxPrice,
				bindableValueKey: 'maxPrice',
				filters: priceFilters
			})}
		</div>
		{@render FilterActionButtons({
			onApply: () => {
				openPriceFilter = false;

				if (!priceFilters.minPrice && !priceFilters.maxPrice) return;

				const hasMaxPrice = priceFilters.maxPrice;

				updateRouteProductFilterQuery({
					productFilterQueryString: `minPrice-${priceFilters.minPrice ?? 0}${hasMaxPrice ? `,maxPrice-${priceFilters.maxPrice}` : ''}`
				});
			},
			onClear: () => {
				openPriceFilter = false;

				priceFilters = {};

				updateRouteProductFilterQuery({
					productFilterKeysToRemove: ['minPrice', 'maxPrice']
				});
			}
		})}
	</ProductFilterPopover>
{/snippet}

{#snippet DimensionFilter()}
	<ProductFilterPopover
		triggerLabel="Dimension"
		hasFilter={hasDimensionsFilter}
		bind:open={openDimensionsFilter}
		{aFilterIsOpen}
	>
		{@render DimensionFilterMinMaxCard({
			id: 'product-width',
			label: 'Width',
			minDefaultValue: parsedProductFilters.minWidth,
			minBindableValueKey: 'minWidth',
			maxDefaultValue: parsedProductFilters.maxWidth,
			maxBindableValueKey: 'maxWidth'
		})}

		{@render DimensionFilterMinMaxCard({
			id: 'product-depth',
			label: 'Depth',
			minDefaultValue: parsedProductFilters.minDepth,
			minBindableValueKey: 'minDepth',
			maxDefaultValue: parsedProductFilters.maxDepth,
			maxBindableValueKey: 'maxDepth'
		})}

		{@render DimensionFilterMinMaxCard({
			id: 'product-height',
			label: 'Height',
			minDefaultValue: parsedProductFilters.minHeight,
			minBindableValueKey: 'minHeight',
			maxDefaultValue: parsedProductFilters.maxHeight,
			maxBindableValueKey: 'maxHeight'
		})}

		{@render FilterActionButtons({
			onApply: () => {
				openDimensionsFilter = false;

				const hasDimensionFilters =
					Object.values(dimensionFilters).filter((value) => value !== undefined).length > 0;
				if (!hasDimensionFilters) return;

				const dimensionFilterQueryArray = Object.entries(dimensionFilters)
					.filter(([, value]) => value !== undefined)
					.map(([key, value]) => `${key}-${value}`);

				updateRouteProductFilterQuery({
					productFilterQueryString: dimensionFilterQueryArray.join(',') as ProductFilterQueryString
				});
			},
			onClear: () => {
				openDimensionsFilter = false;

				dimensionFilters = {};

				updateRouteProductFilterQuery({
					productFilterKeysToRemove: [
						'minWidth',
						'maxWidth',
						'minDepth',
						'maxDepth',
						'minHeight',
						'maxHeight'
					]
				});
			}
		})}
	</ProductFilterPopover>
{/snippet}

{#snippet WeightFilter()}
	<ProductFilterPopover
		triggerLabel="Weight"
		hasFilter={hasWeightFilter}
		bind:open={openWeightFilter}
		{aFilterIsOpen}
	>
		<div class="flex items-center gap-x-4 border-b border-color-border p-4">
			{@render MinMaxFilterTextInput({
				type: 'Min',
				metric: 'lb',
				name: 'minWeight',
				defaultValue: parsedProductFilters.minWeight,
				bindableValueKey: 'minWeight',
				filters: weightFilters
			})}
			{@render MinMaxFilterTextInput({
				type: 'Max',
				metric: 'lb',
				name: 'maxWeight',
				defaultValue: parsedProductFilters.maxWeight,
				bindableValueKey: 'maxWeight',
				filters: weightFilters
			})}
		</div>
		{@render FilterActionButtons({
			onApply: () => {
				openWeightFilter = false;

				if (!weightFilters.minWeight && !weightFilters.maxWeight) return;

				const hasMaxWeight = weightFilters.maxWeight;

				updateRouteProductFilterQuery({
					productFilterQueryString: `minWeight-${weightFilters.minWeight ?? 0}${hasMaxWeight ? `,maxWeight-${weightFilters.maxWeight}` : ''}`
				});
			},
			onClear: () => {
				openWeightFilter = false;

				weightFilters = {};

				updateRouteProductFilterQuery({
					productFilterKeysToRemove: ['minWeight', 'maxWeight']
				});
			}
		})}
	</ProductFilterPopover>
{/snippet}

{#snippet BrandFilter()}
	<ProductFilterPopover
		triggerLabel="Brand"
		hasFilter={hasBrandFilter}
		bind:open={openBrandFilter}
		{aFilterIsOpen}
	>
		<div>
			<div class="scrollbar-thin h-80 space-y-4 overflow-y-auto p-4">
				{#each productBrands as productBrand, index (`${index}-${productBrand}`)}
					{@render CheckBoxFilter({
						id: `${index}-${productBrand}`,
						label: `${productBrand.toUpperCase()}`,
						checked: parsedProductFilters.brand === encodeURIComponent(productBrand),
						onchange: (checked) => {
							openBrandFilter = false;

							if (checked)
								updateRouteProductFilterQuery({
									productFilterQueryString: `brand-${encodeURIComponent(productBrand)}`
								});
							else
								updateRouteProductFilterQuery({
									productFilterKeysToRemove: ['brand']
								});
						}
					})}
				{/each}
			</div>
		</div>
	</ProductFilterPopover>
{/snippet}

{#snippet CheckBoxFilter({
	id,
	label,
	checked,
	onchange
}: {
	id: string;
	label: string;
	checked: boolean;
	onchange: (checked: boolean) => void;
})}
	<div class="flex items-center gap-x-2 text-sm">
		<Checkbox
			{id}
			value={label}
			name={label}
			{checked}
			onchange={(e) => onchange(e.currentTarget.checked)}
		/>
		<label for={id}>{label}</label>
	</div>
{/snippet}

{#snippet MinMaxFilterTextInput<T extends PriceFilters & DimensionFilters & WeightFilters>({
	id,
	name,
	type,
	metric,
	defaultValue,
	bindableValueKey,
	filters
}: {
	id?: string;
	name?: string;
	type: 'Min' | 'Max';
	metric: string;
	defaultValue?: number;
	bindableValueKey: keyof T;
	filters: T;
})}
	<div class="relative w-40">
		<p
			class="absolute top-1/2 left-2 -translate-y-1/2 text-[10px] font-medium text-color-text-muted"
		>
			{type}
		</p>
		<TextInput
			{id}
			{name}
			class="h-8 px-8"
			type="number"
			{defaultValue}
			bind:value={filters[bindableValueKey]}
		/>
		<p
			class="absolute top-1/2 right-2 -translate-y-1/2 text-[10px] font-medium text-color-text-muted"
		>
			{metric}
		</p>
	</div>
{/snippet}

{#snippet FilterActionButtons({
	class: className = '',
	onClear,
	onApply
}: {
	class?: string;
	onClear: () => void;
	onApply: () => void;
})}
	<div class={cn('flex h-12 w-full items-center justify-end gap-x-4 px-4 py-2 text-xs', className)}>
		<Button class="h-full" variant="text" onclick={onClear}>Clear</Button>
		<Button class="h-full w-fit px-8 font-semibold" onclick={onApply}>Apply</Button>
	</div>
{/snippet}

{#snippet DimensionFilterMinMaxCard({
	id,
	label,
	minDefaultValue,
	maxDefaultValue,
	minBindableValueKey,
	maxBindableValueKey
}: {
	id: string;
	label: string;
	minDefaultValue?: number;
	maxDefaultValue?: number;
	minBindableValueKey: keyof DimensionFilters;
	maxBindableValueKey: keyof DimensionFilters;
})}
	<div class="space-y-2 border-b border-color-border p-4">
		<label for={id} class="block text-xs font-medium">{label}</label>
		<form {id} class="flex items-center gap-x-4">
			{@render MinMaxFilterTextInput({
				type: 'Min',
				metric: 'in',
				name: `min${label}`,
				defaultValue: minDefaultValue,
				bindableValueKey: minBindableValueKey,
				filters: dimensionFilters
			})}
			{@render MinMaxFilterTextInput({
				type: 'Max',
				metric: 'in',
				name: `max${label}`,
				defaultValue: maxDefaultValue,
				bindableValueKey: maxBindableValueKey,
				filters: dimensionFilters
			})}
		</form>
	</div>
{/snippet}

{#snippet SortFilter()}
	<ProductSortFilterPopover hasSort={!!hasSortFilter} bind:open={openSortFilter} {aFilterIsOpen}>
		<div class="space-y-4 p-4">
			{@render CheckBoxFilter({
				id: 'price-low-to-high',
				label: 'Price - low to high',
				checked:
					(parsedProductSortOptions?.index.includes('_price') &&
						parsedProductSortOptions?.order === 'asc') ??
					false,
				onchange: (checked) => {
					openSortFilter = false;

					if (checked)
						updateRouteProductSortFilterQuery({
							productSortOptionsQueryString: productCategory
								? `index-by_category_price_cad,order-asc`
								: `index-by_price_cad,order-asc`
						});
					else
						updateRouteProductSortFilterQuery({
							removeSortOptions: 'remove-sort-options'
						});
				}
			})}

			{@render CheckBoxFilter({
				id: 'price-high-to-low',
				label: 'Price - high to low',
				checked:
					(parsedProductSortOptions?.index.includes('_price') &&
						parsedProductSortOptions?.order === 'desc') ??
					false,
				onchange: (checked) => {
					openSortFilter = false;

					if (checked)
						updateRouteProductSortFilterQuery({
							productSortOptionsQueryString: productCategory
								? `index-by_category_price_cad,order-desc`
								: `index-by_price_cad,order-desc`
						});
					else
						updateRouteProductSortFilterQuery({
							removeSortOptions: 'remove-sort-options'
						});
				}
			})}
		</div>
	</ProductSortFilterPopover>
{/snippet}
