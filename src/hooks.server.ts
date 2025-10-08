import { QueryParams } from '$lib/enums';
import authenticate from '$lib/server/authenticate';
import { redirect } from '@sveltejs/kit';

const PUBLIC_ROUTES = ['/', '/auth', '/shop-designs', '/inspiration', '/api', '/favicon.ico'];

export const handle = async ({ event, resolve }) => {
	const { pathname } = event.url;

	const authenticated = await authenticate(event.cookies);

	if (!PUBLIC_ROUTES.some((route) => pathname.startsWith(route)) && !authenticated)
		throw redirect(303, `/auth?${QueryParams.AUTH_REDIRECT_URL}=${encodeURIComponent(pathname)}`);

	event.locals.currentUserId = authenticated?.currentUserId;
	event.locals.activeWorkspaceId = authenticated?.activeWorkspaceId;
	event.locals.authToken = authenticated?.authToken;

	return resolve(event);
};
