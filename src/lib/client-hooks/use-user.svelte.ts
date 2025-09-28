import { api } from '../../convex/_generated/api.js';
import type { UserProfile } from '$lib/types.js';
import { useConvexQuerySubscription } from '$lib/client/convex/use-convex-query-subscription.svelte.js';

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
