import {
	APP_CURRENT_USER_ID_COOKIE_NAME,
	PINTEREST_USER_TOKEN_COOKIE_DELIMITER,
	PINTEREST_USER_TOKEN_COOKIE_NAME
} from '$env/static/private';
import type { ImageData, PinterestPinItem } from '$lib/types';
import { error } from '@sveltejs/kit';

const PAGINATION_SIZE = 50;

export async function GET({ url, cookies }) {
	const userToken = cookies.get(PINTEREST_USER_TOKEN_COOKIE_NAME);
	if (!userToken) throw error(401, 'Unauthorized');

	const userId = cookies.get(APP_CURRENT_USER_ID_COOKIE_NAME);
	if (!userId) throw error(401, 'Unauthorized');

	const userTokenSplit = userToken.split(PINTEREST_USER_TOKEN_COOKIE_DELIMITER);

	const tokenUserId = userTokenSplit[0];
	if (tokenUserId !== userId) throw error(401, 'Unauthorized');

	const token = userTokenSplit[1];

	const bookmark = url.searchParams.get('bookmark');
	const endpoint = bookmark
		? `https://api.pinterest.com/v5/pins?bookmark=${bookmark}&page_size=${PAGINATION_SIZE}`
		: 'https://api.pinterest.com/v5/pins?page_size=50';

	const res = await fetch(endpoint, {
		headers: { Authorization: `Bearer ${token}` }
	});

	const data = await res.json();

	const pins: ImageData[] = data.items.map((pin: PinterestPinItem) => ({
		id: pin.id,
		description: pin.description ?? pin.title,
		url: pin.media?.images?.['1200x']?.url
	}));

	const hasMore = data.items?.length === 50;

	const responseData = {
		pins,
		bookmark: hasMore ? data.bookmark : undefined
	};

	return new Response(JSON.stringify(responseData), {
		headers: { 'Content-Type': 'application/json' }
	});
}
