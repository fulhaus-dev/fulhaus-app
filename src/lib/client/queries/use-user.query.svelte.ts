import { api } from '../../../convex/_generated/api.js';
import type { UserProfile } from '$lib/types.js';
import { useConvexQuerySubscription } from '$lib/client/convex/use-convex-query-subscription.svelte.js';

export function useUserQuery() {
	const { query } = useConvexQuerySubscription(api.v1.user.query.getUser, {});

	const userQuery = $state({
		get loading() {
			return query.loading;
		},
		get error() {
			return query.error;
		},
		get userProfile() {
			return query.response?.data ?? ({} as UserProfile);
		}
	});

	return userQuery;
}
