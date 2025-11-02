import { api } from '../../../convex/_generated/api.js';
import type { Id } from '../../../convex/_generated/dataModel.js';
import { page } from '$app/state';
import { useConvexQuerySubscription } from '$lib/client/convex/use-convex-query-subscription.svelte.js';

export function useDesignLogQuery(designId: () => Id<'designs'>) {
	const currentWorkspaceId = page.params.workspaceId as Id<'workspaces'>;

	const { query } = useConvexQuerySubscription(
		api.v1.design.log.query.getDesignLogsByDesignId,
		() => ({
			workspaceId: currentWorkspaceId!,
			designId: designId()
		}),
		{
			requiredArgsKeys: ['workspaceId', 'designId']
		}
	);

	const designLogQuery = $state({
		get loading() {
			return query.loading;
		},
		get error() {
			return query.error;
		},
		get designLogs() {
			return query.response?.designLogs ?? [];
		},
		get designLogUsers() {
			return query.response?.createdBy ?? [];
		},
		get products() {
			return query.response?.products ?? [];
		}
	});

	return designLogQuery;
}
