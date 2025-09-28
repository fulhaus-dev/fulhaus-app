import { api } from '../../../convex/_generated/api.js';
import type { Id } from '../../../convex/_generated/dataModel.js';
import { page } from '$app/state';
import type { Doc } from '../../../convex/_generated/dataModel.js';
import { useConvexQuerySubscription } from '$lib/client/convex/use-convex-query-subscription.svelte.js';

export function useCurrentWorkspaceQuery() {
	const currentWorkspaceId = page.params.workspaceId as Id<'workspaces'>;

	const { query } = useConvexQuerySubscription(
		api.v1.workspace.query.getWorkspaceById,
		{
			workspaceId: currentWorkspaceId
		},
		{
			requiredArgsKeys: ['workspaceId']
		}
	);

	const currentWorkspaceQuery = $state({
		get loading() {
			return query.loading;
		},
		get error() {
			return query.error;
		},
		get currentWorkspace() {
			return query.response?.data ?? ({} as Doc<'workspaces'>);
		}
	});

	return currentWorkspaceQuery;
}

export function useUserWorkspacesQuery() {
	const { query } = useConvexQuerySubscription(api.v1.workspace.query.getUserWorkspaces, {});

	const userWorkspacesQuery = $state({
		get loading() {
			return query.loading;
		},
		get error() {
			return query.error;
		},
		get userWorkspaces() {
			return query.response?.data ?? [];
		}
	});

	return userWorkspacesQuery;
}
