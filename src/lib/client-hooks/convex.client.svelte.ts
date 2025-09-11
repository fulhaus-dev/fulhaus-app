import { getContext, onDestroy, setContext } from 'svelte';
import { ConvexClient, type ConvexClientOptions } from 'convex/browser';
import { type FunctionReference, type FunctionArgs, type FunctionReturnType } from 'convex/server';
import { browser } from '$app/environment';
import asyncFetch from '$lib/utils/async-fetch';
import { PUBLIC_AUTH_TOKEN_EXP_IN_MINUTES } from '$env/static/public';
import { QueryParams } from '$lib/enums';

const BROWSER = browser;

const _contextKey = 'fh$$_convexClient';

function useConvexClient() {
	const client = getContext(_contextKey) as ConvexClient | undefined;
	if (!client)
		throw new Error(
			'No ConvexClient was found in Svelte context. Did you forget to call setupConvex() in a parent component?'
		);

	return client;
}

function setupConvex(url: string, options: ConvexClientOptions = {}) {
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

	setContext(_contextKey, client);
	$effect(() => () => client.close());
}

function useConvexQuery<Query extends FunctionReference<'query'>>(
	query: Query,
	args: FunctionArgs<Query>,
	options?: {
		onData?: (data: FunctionReturnType<Query>) => void;
		onError?: (error: Error) => void;
	}
) {
	const client = useConvexClient();

	const state = $state({
		data: undefined as FunctionReturnType<Query> | undefined,
		error: undefined as Error | undefined
	});

	let unsubscribe: (() => void) | null = null;

	$effect(() => {
		if (unsubscribe) unsubscribe();

		unsubscribe = client.onUpdate(
			query,
			args,
			(data) => {
				state.data = data;
				options?.onData?.(data);
			},
			(error) => {
				state.error = error;
				options?.onError?.(error);
			}
		);
	});

	onDestroy(() => {
		if (unsubscribe) unsubscribe();
	});

	return {
		query: state
	};
}

export { useConvexClient, setupConvex, useConvexQuery };
