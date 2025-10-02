import type {
	ProductFilter,
	ProductFilterQueryString,
	ProductSortOptions,
	ProductSortOptionsQueryString
} from '$lib/types';
import { zProductFilter, zProductSortOptions } from '$lib/zod-schemas';

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

export function parseProductSortOptions(
	productSortOptionsQueryString: ProductSortOptionsQueryString
) {
	const productSortOptionsRecord = productSortOptionsQueryString.split(',').reduce(
		(acc, filter) => {
			const [key, value] = filter.split('-');
			acc[key] = value;

			return acc;
		},
		{} as Record<string, string>
	);

	return zProductSortOptions.safeParse(productSortOptionsRecord)?.data;
}

export function stringifyProductSortOptions(productSortOptions: ProductSortOptions) {
	return Object.entries(productSortOptions)
		.filter(([, value]) => value !== undefined)
		.map(([key, value]) => `${key}-${value}`)
		.join(',');
}
