import {
	APP_ACTIVE_WORKSPACE_ID_COOKIE_NAME,
	APP_ADMIN_ACCESS_TOKEN,
	APP_ADMIN_ACCESS_TOKEN_COOKIE_NAME,
	APP_CURRENT_USER_ID_COOKIE_NAME,
	APP_ENVIRONMENT,
	AUTH_ACTIVE_SESSION_STATUS_COOKIE_NAME,
	AUTH_SESSION_ID_COOKIE_NAME,
	AUTH_TOKEN_COOKIE_NAME
} from '$env/static/private';
import convexHttpClient from '$lib/server/convex-http-client';
import type { Cookies } from '@sveltejs/kit';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import { asyncTryCatch } from '$lib/utils/try-catch';

export const cookieOptions: {
	path: string;
	secure: boolean;
	httpOnly: boolean;
	sameSite: 'strict' | 'lax' | 'none';
} = {
	path: '/',
	secure: APP_ENVIRONMENT === 'production',
	httpOnly: true,
	sameSite: 'strict'
};

export type SetAuthCookieData = {
	userId: string;
	currentWorkspaceId: string;
	token: string;
	sessionId: string;
	sessionExpInDays: number;
	tokenExpInMinutes: number;
};

export function setAppAdminCookie(cookies: Cookies) {
	cookies.set(APP_ADMIN_ACCESS_TOKEN_COOKIE_NAME, APP_ADMIN_ACCESS_TOKEN, {
		...cookieOptions,
		maxAge: 60 * 60 * 24 * 365 // 1 year
	});
}

export function getAppAdminCookie(cookies: Cookies) {
	return cookies.get(APP_ADMIN_ACCESS_TOKEN_COOKIE_NAME);
}

function setAuthTokenCookie(cookies: Cookies, token: string, tokenCookieMaxAge: number) {
	cookies.set(AUTH_TOKEN_COOKIE_NAME, token, {
		...cookieOptions,
		maxAge: tokenCookieMaxAge
	});
}

export function setAuthCookies(cookies: Cookies, setAuthCookieData: SetAuthCookieData) {
	const { userId, currentWorkspaceId, token, sessionId, sessionExpInDays, tokenExpInMinutes } =
		setAuthCookieData;

	const sessionCookieMaxAge = sessionExpInDays * 24 * 60 * 60;
	const tokenCookieMaxAge = tokenExpInMinutes * 60;

	setAuthTokenCookie(cookies, token, tokenCookieMaxAge);

	cookies.set(AUTH_SESSION_ID_COOKIE_NAME, sessionId, {
		...cookieOptions,
		maxAge: sessionCookieMaxAge
	});

	cookies.set(APP_ACTIVE_WORKSPACE_ID_COOKIE_NAME, currentWorkspaceId, {
		...cookieOptions,
		maxAge: sessionCookieMaxAge
	});

	cookies.set(APP_CURRENT_USER_ID_COOKIE_NAME, userId, {
		...cookieOptions,
		maxAge: sessionCookieMaxAge
	});

	cookies.set(AUTH_ACTIVE_SESSION_STATUS_COOKIE_NAME, 'true', {
		...cookieOptions
	});
}

export function clearAuthCookies(cookies: Cookies) {
	cookies.delete(AUTH_TOKEN_COOKIE_NAME, cookieOptions);
	cookies.delete(AUTH_SESSION_ID_COOKIE_NAME, cookieOptions);
	cookies.delete(APP_ACTIVE_WORKSPACE_ID_COOKIE_NAME, cookieOptions);
	cookies.delete(APP_CURRENT_USER_ID_COOKIE_NAME, cookieOptions);
	cookies.delete(AUTH_ACTIVE_SESSION_STATUS_COOKIE_NAME, cookieOptions);
}

export function getAuthParams(cookies: Cookies) {
	const authSessionId = cookies.get(AUTH_SESSION_ID_COOKIE_NAME) as Id<'sessions'> | undefined;
	const authToken = cookies.get(AUTH_TOKEN_COOKIE_NAME);
	const activeWorkspaceId = cookies.get(APP_ACTIVE_WORKSPACE_ID_COOKIE_NAME) as
		| Id<'workspaces'>
		| undefined;
	const currentUserId = cookies.get(APP_CURRENT_USER_ID_COOKIE_NAME) as Id<'users'> | undefined;
	const authSessionActive = cookies.get(AUTH_ACTIVE_SESSION_STATUS_COOKIE_NAME) as
		| string
		| undefined;

	return { authToken, activeWorkspaceId, currentUserId, authSessionId, authSessionActive };
}

export async function refreshAuthToken(cookies: Cookies, sessionId: Id<'sessions'>) {
	const { data: response } = await asyncTryCatch(() =>
		convexHttpClient.mutation(api.v1.auth.mutation.refreshAuthSession, { sessionId })
	);
	if (!response) return;

	setAuthTokenCookie(cookies, response.token, response.tokenExpInMinutes * 60);

	return response.token;
}

export default async function authenticate(cookies: Cookies) {
	const {
		authToken: currentAuthToken,
		activeWorkspaceId,
		currentUserId,
		authSessionId,
		authSessionActive
	} = getAuthParams(cookies);
	let authToken = currentAuthToken;

	if (!activeWorkspaceId || !currentUserId || !authSessionId) return;

	if (!currentAuthToken && authSessionId) {
		const newAuthToken = await refreshAuthToken(cookies, authSessionId);
		if (!newAuthToken) return;

		authToken = newAuthToken;
	} else if (!authSessionActive) {
		const newAuthToken = await refreshAuthToken(cookies, authSessionId);
		if (!newAuthToken) return;

		authToken = newAuthToken;
	}

	return { activeWorkspaceId, currentUserId, authToken: authToken };
}
