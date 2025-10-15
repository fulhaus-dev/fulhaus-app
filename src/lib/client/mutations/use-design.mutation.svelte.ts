import { page } from '$app/state';
import { useConvexClient } from '$lib/client/convex/use-convex-client.svelte';
import type { UpdateDesignProduct, UpdateDesign } from '$lib/types';
import asyncFetch from '$lib/utils/async-fetch';
import { asyncTryCatch } from '$lib/utils/try-catch';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';

export function useDesignMutation() {
	const convexClient = useConvexClient();
	const activeWorkspaceId = page.params.workspaceId;

	const state = $state({
		error: undefined as string | undefined
	});

	async function updateDesign(designId: Id<'designs'>, updates: UpdateDesign) {
		if (!activeWorkspaceId) return;

		const { floorPlanFileUrl, ...designUpdates } = updates;

		if (floorPlanFileUrl) {
			const { response } = await asyncFetch.get(
				`/api/file-url/get-content-type?url=${encodeURIComponent(floorPlanFileUrl)}`
			);

			if (response) {
				const data = await response.json();

				designUpdates.floorPlanFile = {
					url: floorPlanFileUrl,
					mediaType: data.mediaType
				};
			}
		}

		const { error } = await asyncTryCatch(() =>
			convexClient.mutation(api.v1.design.mutation.updateDesignById, {
				workspaceId: activeWorkspaceId as Id<'workspaces'>,
				designId,
				updates: designUpdates
			})
		);

		if (error) state.error = error.message;
	}

	async function addNewProductToDesign(designId: Id<'designs'>, update: UpdateDesignProduct) {
		if (!activeWorkspaceId) return;

		const { error } = await asyncTryCatch(() =>
			convexClient.mutation(api.v1.design.mutation.addNewProductToDesignById, {
				workspaceId: activeWorkspaceId as Id<'workspaces'>,
				designId,
				update
			})
		);

		if (error) state.error = error.message;
	}

	async function removeProductFromDesign(designId: Id<'designs'>, remove: UpdateDesignProduct) {
		if (!activeWorkspaceId) return;

		const { error } = await asyncTryCatch(() =>
			convexClient.mutation(api.v1.design.mutation.removeProductFromDesignById, {
				workspaceId: activeWorkspaceId as Id<'workspaces'>,
				designId,
				remove
			})
		);

		if (error) state.error = error.message;
	}

	async function addTagsToDesign(designId: Id<'designs'>, tagNames: string[]) {
		if (!activeWorkspaceId) return;

		const { error } = await asyncTryCatch(() =>
			convexClient.mutation(api.v1.design.tag.mutation.saveDesignTags, {
				workspaceId: activeWorkspaceId as Id<'workspaces'>,
				designId,
				tagNames
			})
		);

		if (error) state.error = error.message;
	}

	async function deleteDesignTag(designTagId: Id<'designTags'>) {
		if (!activeWorkspaceId) return;

		const { error } = await asyncTryCatch(() =>
			convexClient.mutation(api.v1.design.tag.mutation.deleteDesignTag, {
				workspaceId: activeWorkspaceId as Id<'workspaces'>,
				designTagId
			})
		);

		if (error) state.error = error.message;
	}

	return {
		designState: state,
		updateDesign,
		addNewProductToDesign,
		removeProductFromDesign,
		addTagsToDesign,
		deleteDesignTag
	};
}
