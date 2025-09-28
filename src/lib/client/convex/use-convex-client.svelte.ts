import { browser } from '$app/environment';
import { PUBLIC_AUTH_TOKEN_EXP_IN_MINUTES } from '$env/static/public';
import { QueryParams } from '$lib/enums';
import asyncFetch from '$lib/utils/async-fetch';
import { ConvexClient, type ConvexClientOptions } from 'convex/browser';
import { getContext, setContext } from 'svelte';

const BROWSER = browser;
const CONVEX_CLIENT_CONTEXT_KEY = 'fh$$_convexClient';

export function useConvexClient() {
	const client = getContext(CONVEX_CLIENT_CONTEXT_KEY) as ConvexClient | undefined;
	if (!client)
		throw new Error(
			'No ConvexClient was found in Svelte context. Did you forget to call setupConvex() in a parent component?'
		);

	return client;
}

export function setupConvex(url: string, options: ConvexClientOptions = {}) {
	if (!url || typeof url !== 'string')
		throw new Error('Expected string url property for setupConvex');

	const optionsWithDefaults = {
		disabled: !BROWSER,
		authRefreshTokenLeewaySeconds: Number(PUBLIC_AUTH_TOKEN_EXP_IN_MINUTES) * 60,
		...options
	};

	const client = new ConvexClient(url, optionsWithDefaults);
	client.setAuth(async ({ forceRefreshToken }) => {
		const { response, error } = await asyncFetch.get(
			`/api/auth/token/get?${QueryParams.FORCE_REFRESH_TOKEN}=${forceRefreshToken ? '1' : '0'}`,
			{
				credentials: 'include',
				cache: 'no-store'
			}
		);
		if (error) return null;

		const { authToken } = await response.json();
		return authToken ?? null;
	});

	setContext(CONVEX_CLIENT_CONTEXT_KEY, client);
	$effect(() => () => client.close());
}
