import { api } from '../../convex/_generated/api.js';
import { asyncTryCatch } from '$lib/utils/try-catch.js';
import { useConvexClient } from '$lib/client-hooks/convex.client.svelte.js';
import type { Doc } from '../../convex/_generated/dataModel.js';
import { onMount } from 'svelte';

export function useUser() {
	const convexClient = useConvexClient();

	const state = $state({
		profile: undefined as Doc<'users'> | undefined
	});

	onMount(async () => {
		const { data: user } = await asyncTryCatch(() =>
			convexClient.query(api.v1.user.query.getUser, {})
		);

		state.profile = user?.data;
	});

	return {
		user: state
	};
}
