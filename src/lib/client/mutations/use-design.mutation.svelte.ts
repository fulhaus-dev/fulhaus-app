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

	async function addTagsToDesign(data: { designId: Id<'designs'>; tagNames: string[] }[]) {
		if (!activeWorkspaceId) return;

		const { error } = await asyncTryCatch(() =>
			convexClient.mutation(api.v1.design.tag.mutation.saveDesignTags, {
				workspaceId: activeWorkspaceId as Id<'workspaces'>,
				data
			})
		);

		if (error) state.error = error.message;
	}

	async function deleteDesignTags(designTagIds: Id<'designTags'>[]) {
		if (!activeWorkspaceId) return;
		if (designTagIds.length < 1) return;

		const { error } = await asyncTryCatch(() =>
			convexClient.mutation(api.v1.design.tag.mutation.deleteDesignTags, {
				workspaceId: activeWorkspaceId as Id<'workspaces'>,
				designTagIds
			})
		);

		if (error) state.error = error.message;
	}

	async function archiveDesigns(designIds: Id<'designs'>[]) {
		if (!activeWorkspaceId) return;
		if (designIds.length < 1) return;

		const { error } = await asyncTryCatch(() =>
			convexClient.mutation(api.v1.design.mutation.archiveDesigns, {
				workspaceId: activeWorkspaceId as Id<'workspaces'>,
				designIds
			})
		);

		if (error) state.error = error.message;
	}

	async function regenerateRender(designId: Id<'designs'>) {
		if (!activeWorkspaceId) return;

		const { error } = await asyncTryCatch(() =>
			convexClient.mutation(api.v1.design.mutation.regenerateRender, {
				workspaceId: activeWorkspaceId as Id<'workspaces'>,
				designId
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
		deleteDesignTags,
		archiveDesigns,
		regenerateRender
	};
}
