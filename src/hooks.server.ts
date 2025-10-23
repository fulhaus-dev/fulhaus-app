import { APP_MAINTENANCE_MODE } from '$env/static/private';
import { QueryParams } from '$lib/enums';
import authenticate from '$lib/server/authenticate';
import { asyncTryCatch } from '$lib/utils/try-catch';
import { redirect } from '@sveltejs/kit';
import geoip from 'fast-geoip';

const PUBLIC_ROUTES = [
	'/',
	'/auth',
	'/shop-designs',
	'/inspiration',
	'/api',
	'/favicon.ico',
	'/maintenance'
];

export const handle = async ({ event, resolve }) => {
	const { pathname } = event.url;

	if (pathname === '/maintenance' && APP_MAINTENANCE_MODE !== 'true') throw redirect(303, '/');

	if (APP_MAINTENANCE_MODE === 'true' && pathname !== '/maintenance')
		throw redirect(303, '/maintenance');

	const authenticated = await authenticate(event.cookies);

	if (!PUBLIC_ROUTES.some((route) => pathname.startsWith(route)) && !authenticated)
		throw redirect(303, `/auth?${QueryParams.AUTH_REDIRECT_URL}=${encodeURIComponent(pathname)}`);

	const clientIp = event.getClientAddress();
	const { data: geo } = await asyncTryCatch(() => geoip.lookup(clientIp));

	let countryCode = geo?.country ?? 'US';
	console.log('countryCode', countryCode);

	if (countryCode !== 'CA') countryCode = 'US';

	event.locals.currentUserId = authenticated?.currentUserId;
	event.locals.activeWorkspaceId = authenticated?.activeWorkspaceId;
	event.locals.authToken = authenticated?.authToken;
	event.locals.currencyCode = countryCode === 'CA' ? 'CAD' : 'USD';

	return resolve(event);
};
