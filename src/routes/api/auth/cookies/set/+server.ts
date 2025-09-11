import { setAuthCookies, type SetAuthCookieData } from '$lib/server/authenticate';

export const POST = async ({ request, cookies }) => {
	const setAuthCookieData: SetAuthCookieData = await request.json();

	const { userId, currentWorkspaceId, token, sessionId } = setAuthCookieData;
	if (!userId || !currentWorkspaceId || !token || !sessionId)
		return new Response(JSON.stringify({ message: 'Bad request' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});

	setAuthCookies(cookies, setAuthCookieData);

	return new Response(JSON.stringify({ message: 'Auth cookie set successfully' }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' }
	});
};
