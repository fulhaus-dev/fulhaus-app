import { QueryParams } from '$lib/enums';
import { getAuthParams, refreshAuthToken } from '$lib/server/authenticate';
import { error } from '@sveltejs/kit';
import type { Id } from '../../../../../convex/_generated/dataModel';

export const GET = async ({ cookies, url }) => {
	const forceRefreshToken = url.searchParams.get(QueryParams.FORCE_REFRESH_TOKEN) === '1';
	const { authSessionId, authToken: currentAuthToken } = getAuthParams(cookies);

	let authToken = currentAuthToken ?? null;

	if ((forceRefreshToken && authSessionId) || (authSessionId && !authToken))
		authToken = await refreshAuthToken(cookies, authSessionId as Id<'sessions'>);

	if (!authToken) throw error(404, 'Token not found');

	return new Response(JSON.stringify({ authToken }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' }
	});
};
