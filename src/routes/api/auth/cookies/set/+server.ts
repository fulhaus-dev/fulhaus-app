import { setAuthCookies, type SetAuthCookieData } from '$lib/server/authenticate';
import { error } from '@sveltejs/kit';

export const POST = async ({ request, cookies }) => {
	const setAuthCookieData: SetAuthCookieData = await request.json();

	const { userId, currentWorkspaceId, token, sessionId } = setAuthCookieData;
	if (!userId || !currentWorkspaceId || !token || !sessionId) throw error(400, 'Bad request');

	setAuthCookies(cookies, setAuthCookieData);

	return new Response(JSON.stringify({ message: 'Auth cookie set successfully' }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' }
	});
};
