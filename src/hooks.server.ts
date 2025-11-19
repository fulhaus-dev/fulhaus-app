import { APP_MAINTENANCE_MODE } from '$env/static/private';
import { QueryParams } from '$lib/enums';
import { getCurrencyCodeCookie, setCurrencyCodeCookie } from '$lib/server/app-currency';
import authenticate from '$lib/server/authenticate';
import { asyncTryCatch } from '$lib/utils/try-catch';
import { redirect } from '@sveltejs/kit';
import geoip from 'fast-geoip';

const PUBLIC_ROUTES = [
	'/',
	'/auth',
	'/shop-designs',
	'/inspiration',
	'/design',
	'/maintenance',
	'/favicon.ico',
	'/api'
];

export const handle = async ({ event, resolve }) => {
	const { pathname } = event.url;

	if (pathname === '/maintenance' && APP_MAINTENANCE_MODE !== 'true') throw redirect(303, '/');

	if (APP_MAINTENANCE_MODE === 'true' && pathname !== '/maintenance')
		throw redirect(303, '/maintenance');

	const authenticated = await authenticate(event.cookies);

	if (!PUBLIC_ROUTES.some((route) => pathname.startsWith(route)) && !authenticated)
		throw redirect(303, `/auth?${QueryParams.AUTH_REDIRECT_URL}=${encodeURIComponent(pathname)}`);

	let currencyCode = getCurrencyCodeCookie(event.cookies);

	if (!currencyCode) {
		const clientIp =
			event.request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
			event.request.headers.get('x-real-ip') ||
			event.getClientAddress();

		const { data: geo } = await asyncTryCatch(() => geoip.lookup(clientIp));

		let countryCode = geo?.country ?? 'US';
		if (countryCode !== 'CA') countryCode = 'US';

		currencyCode = countryCode === 'CA' ? 'CAD' : 'USD';
		setCurrencyCodeCookie(event.cookies, currencyCode);
	}

	event.locals.currentUserId = authenticated?.currentUserId;
	event.locals.activeWorkspaceId = authenticated?.activeWorkspaceId;
	event.locals.authToken = authenticated?.authToken;
	event.locals.currencyCode = currencyCode;

	return resolve(event);
};
