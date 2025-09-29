import type { ProductFilter } from '$lib/types';

export type ProductFilterKey = keyof ProductFilter;
export type ProductFilterQueryString =
	| `${ProductFilterKey}-${string}`
	| `${ProductFilterKey}-${string},${ProductFilterKey}-${string}`;
