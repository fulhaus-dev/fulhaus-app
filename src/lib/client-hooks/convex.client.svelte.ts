import { getContext, onDestroy, setContext } from 'svelte';
import { ConvexClient, type ConvexClientOptions } from 'convex/browser';
import { type FunctionReference, type FunctionArgs, type FunctionReturnType } from 'convex/server';
import { browser } from '$app/environment';
import asyncFetch from '$lib/utils/async-fetch';
import { PUBLIC_AUTH_TOKEN_EXP_IN_MINUTES } from '$env/static/public';
import { QueryParams } from '$lib/enums';
import type { Value } from 'convex/values';

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

function useConvexQuerySubscription<Query extends FunctionReference<'query'>>(
	query: Query,
	args: FunctionArgs<Query> | (() => FunctionArgs<Query>),
	options?: {
		requiredArgsKeys?: string[];
		onData?: (data: FunctionReturnType<Query>) => void;
		onError?: (error: Error) => void;
	}
) {
	const client = useConvexClient();

	const state = $state({
		loading: false,
		response: undefined as FunctionReturnType<Query> | undefined,
		error: undefined as Error | undefined
	});

	let unsubscribe: (() => void) | null = null;

	$effect(() => {
		const argsSnapshot = getArgsSnapshot(args);
		if (!argsSnapshot) return;

		const canSubscribe = checkCanSubscribe(argsSnapshot, options?.requiredArgsKeys);
		if (!canSubscribe) return;

		if (unsubscribe) {
			unsubscribe();
			unsubscribe = null;
		}

		state.loading = true;

		unsubscribe = client.onUpdate(
			query,
			argsSnapshot,
			(data) => {
				state.loading = false;
				state.response = data;
				options?.onData?.(data);
			},
			(error) => {
				state.loading = false;
				state.error = error;
				options?.onError?.(error);
			}
		);
	});

	function getArgsSnapshot(args: Record<string, Value> | (() => Record<string, Value>)) {
		if (typeof args === 'function') args = args();

		return $state.snapshot(args);
	}

	function checkCanSubscribe(argsSnapshot: Record<string, Value>, requiredArgsKeys?: string[]) {
		if (!requiredArgsKeys) return true;

		for (const argKey of requiredArgsKeys) {
			const hasRequiredArgsKeys = requiredArgsKeys.every((key) => key in argsSnapshot);
			if (!hasRequiredArgsKeys) return false;

			const argsSnapshotValue = argsSnapshot[argKey];
			if (
				argsSnapshotValue === null ||
				argsSnapshotValue === undefined ||
				(typeof argsSnapshotValue === 'string' && argsSnapshotValue.trim() === '')
			)
				return false;
		}

		return true;
	}

	onDestroy(() => {
		if (unsubscribe) unsubscribe();
	});

	return { query: state };
}

export { useConvexClient, setupConvex, useConvexQuerySubscription };
