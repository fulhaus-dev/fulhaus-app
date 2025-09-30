// import { goto } from '$app/navigation';
// import { page } from '$app/state';
// import type { QueryParams } from '$lib/enums';
// import { tick } from 'svelte';
// import { SvelteURLSearchParams } from 'svelte/reactivity';

// export type QueryString =
// 	| `${QueryParams}=${string}`
// 	| `${QueryParams}=${string}&${QueryParams}=${string}`;

// type UpdateQueryRoute = {
// 	options?: Parameters<typeof goto>[1];
// } & (
// 	| { queryString: QueryString; queryParamsToRemove?: QueryParams[] }
// 	| { queryString?: QueryString; queryParamsToRemove: QueryParams[] }
// );

// export function useRouteMutation() {
// 	function appendQueryToRoute(queryString: QueryString, options: Parameters<typeof goto>[1] = {}) {
// 		const params = new SvelteURLSearchParams(page.url.searchParams);

// 		const queryStringArray = queryString.split('&');

// 		queryStringArray.forEach((param) => {
// 			const [key, value] = param.split('=');
// 			params.set(key, value);
// 		});

// 		tick().then(() => {
// 			try {
// 				// eslint-disable-next-line svelte/no-navigation-without-resolve
// 				goto(`?${params.toString()}`, options);
// 				// eslint-disable-next-line @typescript-eslint/no-unused-vars
// 			} catch (_) {
// 				// eslint-disable-next-line svelte/no-navigation-without-resolve
// 				setTimeout(() => goto(`?${params.toString()}`, options), 100);
// 			}
// 		});
// 	}

// 	function removeQueryFromRoute(
// 		queryParams: QueryParams[],
// 		options: Parameters<typeof goto>[1] = {}
// 	) {
// 		const params = new SvelteURLSearchParams(page.url.searchParams);

// 		queryParams.forEach((param) => {
// 			params.delete(param);
// 		});

// 		tick().then(() => {
// 			try {
// 				// eslint-disable-next-line svelte/no-navigation-without-resolve
// 				goto(`?${params.toString()}`, options);
// 				// eslint-disable-next-line @typescript-eslint/no-unused-vars
// 			} catch (_) {
// 				// eslint-disable-next-line svelte/no-navigation-without-resolve
// 				setTimeout(() => goto(`?${params.toString()}`, options), 100);
// 			}
// 		});
// 	}

// 	return {
// 		appendQueryToRoute,
// 		removeQueryFromRoute
// 	};
// }

import { goto } from '$app/navigation';
import { page } from '$app/state';
import type { QueryParams } from '$lib/enums';
import { tick } from 'svelte';
import { SvelteURLSearchParams } from 'svelte/reactivity';

export type QueryString =
	| `${QueryParams}=${string}`
	| `${QueryParams}=${string}&${QueryParams}=${string}`;

type UpdateQueryRoute = {
	options?: Parameters<typeof goto>[1];
} & (
	| { queryString: QueryString; queryKeysToRemove?: QueryParams[] }
	| { queryString?: QueryString; queryKeysToRemove: QueryParams[] }
);

export function useRouteMutation() {
	function updateRouteQuery({ queryString, queryKeysToRemove, options = {} }: UpdateQueryRoute) {
		const params = new SvelteURLSearchParams(page.url.searchParams);

		// Remove params first if specified
		if (queryKeysToRemove)
			queryKeysToRemove.forEach((key) => {
				params.delete(key);
			});

		// Add/update params if specified
		if (queryString) {
			const queryStringArray = queryString.split('&');

			queryStringArray.forEach((param) => {
				const [key, value] = param.split('=');
				params.set(key, value);
			});
		}

		// Perform navigation with retry logic
		tick().then(() => {
			try {
				// eslint-disable-next-line svelte/no-navigation-without-resolve
				goto(`?${params.toString()}`, options);
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (_) {
				// eslint-disable-next-line svelte/no-navigation-without-resolve
				setTimeout(() => goto(`?${params.toString()}`, options), 100);
			}
		});
	}

	return {
		updateRouteQuery
	};
}
