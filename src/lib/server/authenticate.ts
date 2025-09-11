import {
	APP_ACTIVE_WORKSPACE_ID_COOKIE_NAME,
	APP_CURRENT_USER_ID_COOKIE_NAME,
	APP_ENVIRONMENT,
	AUTH_SESSION_ID_COOKIE_NAME,
	AUTH_TOKEN_COOKIE_NAME
} from '$env/static/private';
import convexHttpClient from '$lib/server/convex-http-client';
import type { Cookies } from '@sveltejs/kit';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import { asyncTryCatch } from '$lib/utils/try-catch';

export type SetAuthCookieData = {
	userId: string;
	currentWorkspaceId: string;
	token: string;
	sessionId: string;
	sessionExpInDays: number;
	tokenExpInMinutes: number;
};

function setAuthTokenCookie(cookies: Cookies, token: string, tokenCookieMaxAge: number) {
	cookies.set(AUTH_TOKEN_COOKIE_NAME, token, {
		path: '/',
		secure: APP_ENVIRONMENT === 'production',
		httpOnly: true,
		sameSite: 'strict',
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
		path: '/',
		secure: APP_ENVIRONMENT === 'production',
		httpOnly: true,
		sameSite: 'strict',
		maxAge: sessionCookieMaxAge
	});

	cookies.set(APP_ACTIVE_WORKSPACE_ID_COOKIE_NAME, currentWorkspaceId, {
		path: '/',
		secure: APP_ENVIRONMENT === 'production',
		httpOnly: true,
		sameSite: 'strict',
		maxAge: sessionCookieMaxAge
	});

	cookies.set(APP_CURRENT_USER_ID_COOKIE_NAME, userId, {
		path: '/',
		secure: APP_ENVIRONMENT === 'production',
		httpOnly: true,
		sameSite: 'strict',
		maxAge: sessionCookieMaxAge
	});
}

export function getAuthParams(cookies: Cookies) {
	const authSessionId = cookies.get(AUTH_SESSION_ID_COOKIE_NAME) as Id<'sessions'> | undefined;
	const authToken = cookies.get(AUTH_TOKEN_COOKIE_NAME);
	const activeWorkspaceId = cookies.get(APP_ACTIVE_WORKSPACE_ID_COOKIE_NAME) as
		| Id<'workspaces'>
		| undefined;
	const currentUserId = cookies.get(APP_CURRENT_USER_ID_COOKIE_NAME) as Id<'users'> | undefined;

	return { authToken, activeWorkspaceId, currentUserId, authSessionId };
}

export async function refreshAuthToken(cookies: Cookies, sessionId: Id<'sessions'>) {
	const { data: response } = await asyncTryCatch(() =>
		convexHttpClient.mutation(api.v1.auth.mutation.refreshAuthSession, { sessionId })
	);
	if (!response) return null;

	setAuthTokenCookie(cookies, response.token, response.tokenExpInMinutes * 60);

	return response.token;
}

export default async function authenticate(cookies: Cookies) {
	const { authToken, activeWorkspaceId, currentUserId, authSessionId } = getAuthParams(cookies);

	if (!activeWorkspaceId || !currentUserId || !authSessionId) return;

	if (!authToken && authSessionId) {
		const newAuthToken = await refreshAuthToken(cookies, authSessionId);
		if (!newAuthToken) return;
	}

	return { activeWorkspaceId, currentUserId };
}
