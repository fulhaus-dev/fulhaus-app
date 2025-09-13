import { redirect } from '@sveltejs/kit';

import { PINTEREST_APP_ID, PINTEREST_AUTH_CALLBACK_REDIRECT_URI } from '$env/static/private';

export async function GET({ url, locals }) {
	const noAuthRedirectUrl = `/auth?redirect=${encodeURIComponent('/auth/pinterest')}`;

	const activeWorkspaceId = locals.activeWorkspaceId;
	if (!activeWorkspaceId) throw redirect(303, noAuthRedirectUrl);

	const currentUserId = locals.currentUserId;
	if (!currentUserId) throw redirect(303, noAuthRedirectUrl);

	const redirectTo = url.searchParams.get('redirect') ?? '/';

	const params = new URLSearchParams({
		response_type: 'code',
		client_id: PINTEREST_APP_ID,
		redirect_uri: PINTEREST_AUTH_CALLBACK_REDIRECT_URI,
		scope: 'boards:read,pins:read',
		state: JSON.stringify({ userId: currentUserId, redirectTo })
	});

	const pinterestAuthUrl = `https://www.pinterest.com/oauth/?${params.toString()}`;

	throw redirect(302, pinterestAuthUrl);
}
