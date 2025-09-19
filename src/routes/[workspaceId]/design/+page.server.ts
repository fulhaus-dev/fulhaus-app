import { QueryParams } from '$lib/enums.js';
import { error } from '@sveltejs/kit';

export function load({ url }) {
	if (!url.searchParams.has(QueryParams.LUDWIG_CHAT_ID)) throw error(404, 'Not found');
}
