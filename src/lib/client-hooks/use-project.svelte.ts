import { page } from '$app/state';
import { useConvexClient } from '$lib/client-hooks/convex.client.svelte.js';
import type { UpdateProject } from '$lib/types';
import { asyncTryCatch } from '$lib/utils/try-catch';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';

export function useProject() {
	const convexClient = useConvexClient();
	const activeWorkspaceId = page.params.workspaceId;

	const state = $state({
		error: undefined as string | undefined
	});

	async function updateProject(projectId: Id<'projects'>, updates: UpdateProject) {
		if (!activeWorkspaceId) return;

		const { error } = await asyncTryCatch(() =>
			convexClient.mutation(api.v1.project.mutation.updateProjectById, {
				workspaceId: activeWorkspaceId as Id<'workspaces'>,
				projectId,
				updates
			})
		);

		if (error) state.error = error.message;
	}

	return {
		project: state,
		updateProject
	};
}
