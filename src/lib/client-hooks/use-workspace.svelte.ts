import { api } from '../../convex/_generated/api.js';
import { asyncTryCatch } from '$lib/utils/try-catch.js';
import type { Id } from '../../convex/_generated/dataModel.js';
import { useConvexClient } from '$lib/client-hooks/convex.client.svelte.js';
import { page } from '$app/state';
import type { Doc } from '../../convex/_generated/dataModel.js';
import { onMount } from 'svelte';

export function useWorkspace() {
	const convexClient = useConvexClient();

	const currentWorkspaceId = page.params.workspaceId as Id<'workspaces'>;

	const state = $state({
		currentWorkspace: undefined as Doc<'workspaces'> | undefined
	});

	onMount(async () => {
		if (!currentWorkspaceId) return;
		const { data: workspace } = await asyncTryCatch(() =>
			convexClient.query(api.v1.workspace.query.getWorkspaceById, {
				workspaceId: currentWorkspaceId
			})
		);

		state.currentWorkspace = workspace?.data;
	});

	return {
		workspace: state
	};
}
