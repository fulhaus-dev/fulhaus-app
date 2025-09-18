import { page } from '$app/state';
import { useConvexClient } from '$lib/client-hooks/convex.client.svelte.js';
import type { UpdateDesign } from '$lib/types';
import { asyncTryCatch } from '$lib/utils/try-catch';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';

export function useDesign() {
	const convexClient = useConvexClient();
	const activeWorkspaceId = page.params.workspaceId;

	const state = $state({
		error: undefined as string | undefined
	});

	async function updateDesign(designId: Id<'designs'>, updates: UpdateDesign) {
		if (!activeWorkspaceId) return;

		const { error } = await asyncTryCatch(() =>
			convexClient.mutation(api.v1.design.mutation.updateDesignById, {
				workspaceId: activeWorkspaceId as Id<'workspaces'>,
				designId,
				updates
			})
		);

		if (error) state.error = error.message;
	}

	return {
		design: state,
		updateDesign
	};
}
