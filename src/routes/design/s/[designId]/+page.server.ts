import { QueryParams } from '$lib/enums.js';
import { error } from '@sveltejs/kit';

export function load({ url }) {
	if (!url.searchParams.has(QueryParams.DESIGN_CURRENCY_CODE)) throw error(404, 'Not found');
}
