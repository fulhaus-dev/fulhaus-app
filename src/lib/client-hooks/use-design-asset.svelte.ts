import { api } from '../../convex/_generated/api.js';
import type { Id } from '../../convex/_generated/dataModel.js';
import { useConvexQuerySubscription } from '$lib/client-hooks/convex.client.svelte.js';
import { page } from '$app/state';
import type { Doc } from '../../convex/_generated/dataModel.js';

export function useDesignAsset() {
	const currentWorkspaceId = page.params.workspaceId as Id<'workspaces'>;

	const state = $state({
		assets: [] as Doc<'workspaceAssets'>[]
	});

	useConvexQuerySubscription(
		api.v1.workspace.asset.query.getWorkspaceAssets,
		{
			workspaceId: currentWorkspaceId
		},
		{
			requiredArgsKeys: ['workspaceId'],
			onData: (designAssetQuery) => {
				state.assets = designAssetQuery.data;
			}
		}
	);

	return {
		designAsset: state
	};
}
