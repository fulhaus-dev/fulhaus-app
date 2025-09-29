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

	const { productToSwapCategory }: { productToSwapCategory: ProductCategory } = $props();
	const productFilters = (page.url.searchParams.get(QueryParams.PRODUCT_FILTERS) ??
		'') as ProductFilterQueryString;
	const parsedProductFilters = $derived.by(() => parseProductFilters(productFilters));
	const { appendQueryToRoute, removeQueryFromRoute } = useRouteMutation();

	function appendFilterToRoute(productFilterQueryString: ProductFilterQueryString) {
		const currentProductFilters = parseProductFilters(productFilterQueryString);
		const newProductFilters = { ...parsedProductFilters, ...currentProductFilters };

		appendQueryToRoute(
			`${QueryParams.PRODUCT_FILTERS}=${stringifyProductFilters(newProductFilters)}`,
			{
				keepFocus: true
			}
		);
	}

	function removeFilterFromRoute(productFilterQueryKeys: ProductFilterKey[]) {
		const removedQueryFilterKeys = productFilterQueryKeys.reduce(
			(acc, key) => {
				acc[key] = undefined;

				return acc;
			},
			{} as Record<ProductFilterKey, undefined>
		);

		const currentProductFilters = { ...parsedProductFilters, ...removedQueryFilterKeys };

		if (Object.values(currentProductFilters).filter(Boolean).length < 1) {
			removeQueryFromRoute([QueryParams.PRODUCT_FILTERS], {
				keepFocus: true
			});

			return;
		}

		appendQueryToRoute(
			`${QueryParams.PRODUCT_FILTERS}=${stringifyProductFilters(currentProductFilters)}`,
			{
				keepFocus: true
			}
		);
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

				if (searchValue) appendFilterToRoute(`name-${searchValue}`);
				else removeFilterFromRoute(['name']);
			}}
		/>
	</div>

	<div class="flex w-full items-center justify-between">
		<div class="flex w-full items-center gap-x-1">
			{@render AvailabilityFilter()}
			{@render PriceFilter()}
			{@render DimensionFilter()}
			{@render WeightFilter()}
			{@render BrandFilter()}
			<Button class="ml-4 text-xs font-medium text-color-text-muted" variant="text"
				>Clear filters</Button
			>
		</div>

		<Button
			class="size-6 rounded-sm border-color-border p-px text-color-text-muted ring-0"
			variant="outlined"
		>
			<ArrowDownWideNarrowIcon class="size-full" />
		</Button>
	</div>
</div>

{#snippet AvailabilityFilter()}
	<DesignProductSwapFilterPopover triggerLabel="Availability">
		<div class="w-fit space-y-4">
			{@render CheckBoxFilter({
				id: 'in-stock',
				label: 'In stock',
				checked: !!parsedProductFilters.minStock && parsedProductFilters.minStock === 1,
				onchange: (checked) => {
					if (checked) appendFilterToRoute(`minStock-${1}`);
					if (!checked) removeFilterFromRoute(['minStock']);
				}
			})}

			{@render CheckBoxFilter({
				id: 'out-of-stock',
				label: 'Out of stock',
				checked: !!parsedProductFilters.maxStock && parsedProductFilters.maxStock === 0,
				onchange: (checked) => {
					if (checked) appendFilterToRoute(`maxStock-${0}`);
					if (!checked) removeFilterFromRoute(['maxStock']);
				}
			})}
		</div>
	</DesignProductSwapFilterPopover>
{/snippet}

{#snippet PriceFilter()}
	<DesignProductSwapFilterPopover triggerLabel="Price">
		<div class="w-fit space-y-4"></div>
	</DesignProductSwapFilterPopover>
{/snippet}

{#snippet DimensionFilter()}
	<DesignProductSwapFilterPopover triggerLabel="Dimension">
		<div class="w-fit space-y-4"></div>
	</DesignProductSwapFilterPopover>
{/snippet}

{#snippet WeightFilter()}
	<DesignProductSwapFilterPopover triggerLabel="Weight">
		<div class="w-fit space-y-4"></div>
	</DesignProductSwapFilterPopover>
{/snippet}

{#snippet BrandFilter()}
	<DesignProductSwapFilterPopover triggerLabel="Brand">
		<div class="w-fit space-y-4"></div>
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
		<Checkbox {id} value={label} {checked} onchange={(e) => onchange(e.currentTarget.checked)} />
		<label for={id}>{label}</label>
	</div>
{/snippet}
