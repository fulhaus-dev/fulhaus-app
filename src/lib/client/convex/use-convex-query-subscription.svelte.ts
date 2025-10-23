import { useConvexClient } from '$lib/client/convex/use-convex-client.svelte';
import type { FunctionArgs, FunctionReference, FunctionReturnType } from 'convex/server';
import { onDestroy } from 'svelte';

export function useConvexQuerySubscription<Query extends FunctionReference<'query'>>(
	query: Query,
	args: FunctionArgs<Query> | (() => FunctionArgs<Query>),
	options?: {
		requiredArgsKeys?: string[];
		debounceDelay?: number;
		onLoading?: (value: boolean) => void;
		onData?: (data: FunctionReturnType<Query>) => void;
		onError?: (error: Error) => void;
	}
) {
	const client = useConvexClient();

	type QueryReturnType = FunctionReturnType<Query>;
	type QueryArgs = FunctionArgs<Query>;

	const state = $state({
		loading: true,
		response: undefined as QueryReturnType | undefined,
		error: undefined as Error | undefined
	});

	let unsubscribe: (() => void) | null = null;

	$effect(() => {
		handleLoadingState(true);

		const argsSnapshot = getArgsSnapshot(args);
		if (!argsSnapshot) return handleLoadingState(false);

		const canSubscribe = checkCanSubscribe(argsSnapshot, options?.requiredArgsKeys);
		if (!canSubscribe) return handleLoadingState(false);

		const debounceDelay = options?.debounceDelay ?? 0;

		let timeoutId: ReturnType<typeof setTimeout> | undefined = undefined;
		if (timeoutId) clearTimeout(timeoutId);

		timeoutId = setTimeout(() => {
			if (unsubscribe) {
				unsubscribe();
				unsubscribe = null;
			}

			unsubscribe = client.onUpdate(
				query,
				argsSnapshot,
				(data) => {
					state.response = data;
					options?.onData?.(data);
					return handleLoadingState(false);
				},
				(error) => {
					state.error = error;
					options?.onError?.(error);
					return handleLoadingState(false);
				}
			);
		}, debounceDelay);

		return () => {
			if (timeoutId) clearTimeout(timeoutId);
		};
	});

	function handleLoadingState(loading: boolean) {
		state.loading = loading;
		options?.onLoading?.(loading);
	}

	function getArgsSnapshot(args: QueryArgs | (() => QueryArgs)) {
		const resolvedArgs = typeof args === 'function' ? (args as () => QueryArgs)() : args;

		return $state.snapshot(resolvedArgs) as QueryArgs;
	}

	function checkCanSubscribe(argsSnapshot: QueryArgs, requiredArgsKeys?: string[]) {
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
