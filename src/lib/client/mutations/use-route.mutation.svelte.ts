import { goto } from '$app/navigation';
import { page } from '$app/state';
import type { QueryParams } from '$lib/enums';
import { tick } from 'svelte';
import { SvelteURLSearchParams } from 'svelte/reactivity';

export type QueryString =
	| `${QueryParams}=${string}`
	| `${QueryParams}=${string}&${QueryParams}=${string}`;

export function useRouteMutation() {
	function appendQueryToRoute(queryString: QueryString, options: Parameters<typeof goto>[1] = {}) {
		const params = new SvelteURLSearchParams(page.url.searchParams);

		const queryStringArray = queryString.split('&');

		queryStringArray.forEach((param) => {
			const [key, value] = param.split('=');
			params.set(key, value);
		});

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

	function removeQueryFromRoute(
		queryParams: QueryParams[],
		options: Parameters<typeof goto>[1] = {}
	) {
		const params = new SvelteURLSearchParams(page.url.searchParams);

		queryParams.forEach((param) => {
			params.delete(param);
		});

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
		appendQueryToRoute,
		removeQueryFromRoute
	};
}
