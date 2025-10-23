import { api } from '../../../convex/_generated/api.js';
import type { Id } from '../../../convex/_generated/dataModel.js';
import { page } from '$app/state';
import { useConvexQuerySubscription } from '$lib/client/convex/use-convex-query-subscription.svelte.js';

export function useDesignAssetQuery() {
	const currentWorkspaceId = page.params.workspaceId as Id<'workspaces'>;

	const { query } = useConvexQuerySubscription(
		api.v1.workspace.asset.query.getWorkspaceAssets,
		{
			workspaceId: currentWorkspaceId
		},
		{
			requiredArgsKeys: ['workspaceId']
		}
	);

	const designAssetQuery = $state({
		get loading() {
			return query.loading;
		},
		get error() {
			return query.error;
		},
		get designAssets() {
			return query.response?.workspaceAssets ?? [];
		}
	});

	return designAssetQuery;
}
