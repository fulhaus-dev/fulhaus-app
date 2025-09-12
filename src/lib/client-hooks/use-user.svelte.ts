import { api } from '../../convex/_generated/api.js';
import { useConvexQuerySubscription } from '$lib/client-hooks/convex.client.svelte.js';
import type { UserProfile } from '$lib/types.js';

export function useUser() {
	const state = $state({
		profile: {} as UserProfile
	});

	useConvexQuerySubscription(
		api.v1.user.query.getUser,
		{},
		{
			onData: (userQuery) => {
				state.profile = userQuery.data;
			}
		}
	);

	return {
		user: state
	};
}
