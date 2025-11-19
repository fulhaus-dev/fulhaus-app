import { PINTEREST_USER_TOKEN_COOKIE_NAME } from '$env/static/private';
import type { ImageData, PinterestPinItem } from '$lib/types';

const PAGINATION_SIZE = 50;

export async function GET({ url, cookies }) {
	const userToken = cookies.get(PINTEREST_USER_TOKEN_COOKIE_NAME);
	if (!userToken) return new Response('Unauthorized', { status: 401 });

	const bookmark = url.searchParams.get('bookmark');
	const endpoint = bookmark
		? `https://api.pinterest.com/v5/pins?bookmark=${bookmark}&page_size=${PAGINATION_SIZE}`
		: 'https://api.pinterest.com/v5/pins?page_size=50';

	const res = await fetch(endpoint, {
		headers: { Authorization: `Bearer ${userToken}` }
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
