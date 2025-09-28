import { useConvexClient } from '$lib/client/convex/use-convex-client.svelte';
import type { FunctionArgs, FunctionReference, FunctionReturnType } from 'convex/server';
import type { Value } from 'convex/values';
import { onDestroy } from 'svelte';

export function useConvexQuerySubscription<Query extends FunctionReference<'query'>>(
	query: Query,
	args: FunctionArgs<Query> | (() => FunctionArgs<Query>),
	options?: {
		requiredArgsKeys?: string[];
		onLoading?: (value: boolean) => void;
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
		options?.onLoading?.(true);

		unsubscribe = client.onUpdate(
			query,
			argsSnapshot,
			(data) => {
				state.response = data;
				state.loading = false;
				options?.onData?.(data);
				options?.onLoading?.(false);
			},
			(error) => {
				state.error = error;
				state.loading = false;
				options?.onError?.(error);
				options?.onLoading?.(false);
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
