import { AUTH_TOKEN_COOKIE_NAME, LUDWIG_CHAT_URL } from '$env/static/private';
import { error } from '@sveltejs/kit';

export const POST = async ({ request, cookies }) => {
	const workspaceId = request.headers.get('x-workspace-id');
	if (!workspaceId) return new Response('Missing workspace ID', { status: 400 });

	const authToken = cookies.get(AUTH_TOKEN_COOKIE_NAME);
	if (!authToken) throw error(401, 'Unauthorized!');

	return await fetch(LUDWIG_CHAT_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-Workspace-Id': workspaceId,
			Authorization: `Bearer ${authToken}`
		},
		body: await request.text()
	});
};
