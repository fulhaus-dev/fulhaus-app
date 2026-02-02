import { api } from '../../../convex/_generated/api.js';
import type { Id } from '../../../convex/_generated/dataModel.js';
import { page } from '$app/state';
import { useConvexQuerySubscription } from '$lib/client/convex/use-convex-query-subscription.svelte.js';

export function useCreditPoolQuery() {
	const currentCreditPoolId = page.params.creditPoolId as Id<'creditPools'> | undefined;

	const { query } = useConvexQuerySubscription(
		api.v1.credit.pool.query.getCreditPoolById,
		() => ({
			poolId: currentCreditPoolId!
		}),
		{
			requiredArgsKeys: ['poolId']
		}
	);

	const creditPoolQuery = $state({
		get loading() {
			return query.loading;
		},
		get error() {
			return query.error;
		},
		get creditPool() {
			return query.response;
		}
	});

	return creditPoolQuery;
}

export function useCreditPoolMembersQuery() {
	const currentCreditPoolId = page.params.creditPoolId as Id<'creditPools'> | undefined;

	const { query } = useConvexQuerySubscription(
		api.v1.credit.pool.member.query.getCreditPoolMembersByPoolId,
		() => ({
			poolId: currentCreditPoolId!
		}),
		{
			requiredArgsKeys: ['poolId']
		}
	);

	const creditPoolMembersQuery = $state({
		get loading() {
			return query.loading;
		},
		get error() {
			return query.error;
		},
		get creditPoolMembers() {
			return query.response?.creditPoolMembers ?? [];
		}
	});

	return creditPoolMembersQuery;
}
