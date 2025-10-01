import type { ProductFilter, ProductFilterQueryString } from '$lib/types';
import { zProductFilter } from '$lib/zod-schemas';

export function parseProductFilters(productFilterQueryString: ProductFilterQueryString) {
	const productFiltersRecord = productFilterQueryString.split(',').reduce(
		(acc, filter) => {
			const [key, value] = filter.split('-');
			acc[key] = value;

			return acc;
		},
		{} as Record<string, string>
	);

	return zProductFilter.safeParse(productFiltersRecord)?.data ?? {};
}

export function stringifyProductFilters(productFilter: ProductFilter) {
	return Object.entries(productFilter)
		.filter(([, value]) => value !== undefined)
		.map(([key, value]) => `${key}-${value}`)
		.join(',');
}
