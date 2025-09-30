<script lang="ts">
	import { page } from '$app/state';
	import { useRouteMutation } from '$lib/client/mutations/use-route.mutation.svelte';
	import type {
		ProductFilterKey,
		ProductFilterQueryString
	} from '$lib/components/design/design-product-swap/design-product-swap.types';
	import {
		parseProductFilters,
		stringifyProductFilters
	} from '$lib/components/design/design-product-swap/design-product-swap.utils';
	import TextInput from '$lib/components/text-input.svelte';
	import { QueryParams } from '$lib/enums';
	import type { ProductCategory } from '$lib/types';
	import { ArrowDownWideNarrowIcon, SearchIcon } from '@lucide/svelte';
	import DesignProductSwapFilterPopover from '$lib/components/design/design-product-swap/design-product-swap.filter-popover.svelte';
	import Checkbox from '$lib/components/checkbox.svelte';
	import Button from '$lib/components/button.svelte';
	import { cn } from '$lib/utils/cn';
	import { useProductBrandsByCategoryQuery } from '$lib/client/queries/use-product.query.svelte';

	type UpdateRouteProductFilterQuery = {
		productFilterQueryString?: ProductFilterQueryString;
		productFilterKeysToRemove?: ProductFilterKey[];
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

	const { productToSwapCategory }: { productToSwapCategory: ProductCategory } = $props();

	const { updateRouteQuery } = useRouteMutation();

	let cursor = $state<string | undefined>(undefined);
	const productBrandsByCategoryQuery = useProductBrandsByCategoryQuery(
		productToSwapCategory,
		() => cursor
	);

	const productBrands = $derived(productBrandsByCategoryQuery.productBrands.brands ?? []);
	const currentCursor = $derived(productBrandsByCategoryQuery.productBrands.cursor);
	const hasMoreBrands = $derived(productBrandsByCategoryQuery.productBrands.isDone);

	let priceFilters = $state<PriceFilters>({});
	let dimensionFilters = $state<DimensionFilters>({});
	let weightFilters = $state<WeightFilters>({});

	let openAvailabilityFilter = $state(false);
	let openPriceFilter = $state(false);
	let openDimensionsFilter = $state(false);
	let openWeightFilter = $state(false);
	let openBrandFilter = $state(false);

	const aFilterIsOpen = $derived(
		openAvailabilityFilter ||
			openPriceFilter ||
			openDimensionsFilter ||
			openWeightFilter ||
			openBrandFilter
	);

	const productFilters = $derived.by(
		() => page.url.searchParams.get(QueryParams.PRODUCT_FILTERS) ?? ''
	) as ProductFilterQueryString;
	const parsedProductFilters = $derived.by(() => parseProductFilters(productFilters));

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

	function clearFilters() {
		priceFilters = {};
		dimensionFilters = {};
		weightFilters = {};

		updateRouteQuery({
			queryKeysToRemove: [QueryParams.PRODUCT_FILTERS],
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
			placeholder={`Search for ${productToSwapCategory} by name`}
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

		<Button
			class={cn(
				'size-6 rounded-sm border-color-border bg-color-background p-px text-color-text-muted ring-0',
				aFilterIsOpen && 'opacity-20'
			)}
			variant="outlined"
		>
			<ArrowDownWideNarrowIcon class="size-full" />
		</Button>
	</div>
</div>

{#snippet AvailabilityFilter()}
	<DesignProductSwapFilterPopover
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
	</DesignProductSwapFilterPopover>
{/snippet}

{#snippet PriceFilter()}
	<DesignProductSwapFilterPopover
		triggerLabel="Price"
		hasFilter={hasPriceFilter}
		bind:open={openPriceFilter}
		{aFilterIsOpen}
	>
		<div class="flex items-center gap-x-4 border-b border-color-border p-4">
			{@render MinMaxFilterTextInput({
				type: 'Min',
				metric: 'CAD',
				name: 'minPrice',
				defaultValue: parsedProductFilters.minPrice,
				bindableValueKey: 'minPrice',
				filters: priceFilters
			})}
			{@render MinMaxFilterTextInput({
				type: 'Max',
				metric: 'CAD',
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
	</DesignProductSwapFilterPopover>
{/snippet}

{#snippet DimensionFilter()}
	<DesignProductSwapFilterPopover
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
	</DesignProductSwapFilterPopover>
{/snippet}

{#snippet WeightFilter()}
	<DesignProductSwapFilterPopover
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
	</DesignProductSwapFilterPopover>
{/snippet}

{#snippet BrandFilter()}
	<DesignProductSwapFilterPopover
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
	</DesignProductSwapFilterPopover>
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
