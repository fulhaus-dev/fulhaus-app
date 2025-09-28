import { api } from '../../convex/_generated/api.js';
import type { Id } from '../../convex/_generated/dataModel.js';
import { page } from '$app/state';
import type { Doc } from '../../convex/_generated/dataModel.js';
import { useConvexQuerySubscription } from '$lib/client/convex/use-convex-query-subscription.svelte.js';

export function useWorkspace() {
	const currentWorkspaceId = page.params.workspaceId as Id<'workspaces'>;

	const state = $state({
		currentWorkspace: undefined as Doc<'workspaces'> | undefined
	});

	useConvexQuerySubscription(
		api.v1.workspace.query.getWorkspaceById,
		{
			workspaceId: currentWorkspaceId
		},
		{
			requiredArgsKeys: ['workspaceId'],
			onData: (workspaceQuery) => {
				state.currentWorkspace = workspaceQuery.data;
			}
		}
	);

	return {
		workspace: state
	};
}
