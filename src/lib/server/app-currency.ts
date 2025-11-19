import { APP_CURRENCY_CODE_COOKIE_NAME } from '$env/static/private';
import { cookieOptions } from '$lib/server/authenticate';
import type { CurrencyCode } from '$lib/types';
import type { Cookies } from '@sveltejs/kit';

export function setCurrencyCodeCookie(cookies: Cookies, countryCode: string) {
	cookies.set(APP_CURRENCY_CODE_COOKIE_NAME, countryCode, {
		...cookieOptions,
		maxAge: 60 * 60 * 24 * 365 // 1 year
	});
}

export function getCurrencyCodeCookie(cookies: Cookies) {
	return cookies.get(APP_CURRENCY_CODE_COOKIE_NAME) as CurrencyCode | undefined;
}
