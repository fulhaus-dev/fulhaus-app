import { QueryParams } from '$lib/enums';
import { getAuthParams, refreshAuthToken } from '$lib/server/authenticate';
import type { Id } from '../../../../../convex/_generated/dataModel';

export const GET = async ({ cookies, url }) => {
	const forceRefreshToken = url.searchParams.get(QueryParams.FORCE_REFRESH_TOKEN) === '1';
	const { authSessionId, authToken: currentAuthToken } = getAuthParams(cookies);

	let authToken = currentAuthToken;

	if ((forceRefreshToken && authSessionId) || (authSessionId && !authToken))
		authToken = await refreshAuthToken(cookies, authSessionId as Id<'sessions'>);

	if (!authToken)
		return new Response(JSON.stringify({ authToken }), {
			status: 404,
			headers: { 'Content-Type': 'application/json' }
		});

	return new Response(JSON.stringify({ authToken }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' }
	});
};
