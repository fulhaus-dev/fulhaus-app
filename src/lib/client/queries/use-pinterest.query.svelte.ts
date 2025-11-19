import type { ImageData } from '$lib/types';
import asyncFetch from '$lib/utils/async-fetch.js';
import { onMount } from 'svelte';

export function usePinterestQuery() {
	let loading = $state(false);
	let error = $state<string>();
	let pins = $state<ImageData[]>([]);
	let bookmark = $state<string>();

	onMount(() => {
		getUserPinterestPins();
	});

	async function getUserPinterestPins() {
		error = undefined;
		loading = true;

		const { response, error: getPinsError } = await asyncFetch.get(
			`/api/pinterest/pins${bookmark ? `?bookmark=${bookmark}` : ''}`
		);

		loading = false;

		if (getPinsError) {
			error = getPinsError.message ?? "Couldn't get user's pins";
			return;
		}

		const data = await response.json();

		pins = data.pins;
		bookmark = data.bookmark;
	}

	const pinterestQuery = $state({
		get loading() {
			return loading;
		},
		get error() {
			return error;
		},
		get pins() {
			return pins;
		},
		getUserPinterestPins
	});

	return pinterestQuery;
}
