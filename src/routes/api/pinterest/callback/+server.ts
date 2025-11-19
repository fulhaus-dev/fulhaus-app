import { error, redirect } from '@sveltejs/kit';

import { env } from '$env/dynamic/private';
import { APP_ENVIRONMENT, PINTEREST_USER_TOKEN_COOKIE_NAME } from '$env/static/private';
import { tryCatch } from '$lib/utils/try-catch.js';
import { QueryParams } from '$lib/enums.js';

const encodeBase64 = (str: string) => {
	return globalThis.Buffer?.from(str).toString('base64') ?? '';
};

export async function GET({ url, cookies }) {
	const code = url.searchParams.get('code');
	if (!code) throw error(500, 'Could not connect to Pinterest');

	const stateString = url.searchParams.get('state');
	const { data: state } = tryCatch<{ userId: string; redirectTo: string }>(() =>
		JSON.parse(stateString ?? '')
	);

	const redirectTo = state?.redirectTo ?? '/';

	const params = new URLSearchParams({
		grant_type: 'authorization_code',
		code,
		redirect_uri: env.PINTEREST_AUTH_CALLBACK_REDIRECT_URI
	});

	const authString = `${env.PINTEREST_APP_ID}:${env.PINTEREST_APP_SECRET}`;
	const authHeader = `Basic ${encodeBase64(authString)}`;

	const tokenResponse = await fetch('https://api.pinterest.com/v5/oauth/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: authHeader
		},
		body: params
	});
	const tokenData = await tokenResponse.json();

	cookies.set(PINTEREST_USER_TOKEN_COOKIE_NAME, tokenData.access_token, {
		path: '/',
		secure: APP_ENVIRONMENT === 'production',
		httpOnly: true,
		sameSite: 'strict',
		maxAge: tokenData.expires_in
	});

	redirect(
		302,
		`/pinterest/success?${QueryParams.PINTEREST_CALLBACK_REDIRECT_URL}=${encodeURIComponent(
			redirectTo
		)}`
	);
}
