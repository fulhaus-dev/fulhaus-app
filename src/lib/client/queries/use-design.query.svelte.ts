import { api } from '../../../convex/_generated/api.js';
import { page } from '$app/state';
import { QueryParams } from '$lib/enums.js';
import type { Id } from '../../../convex/_generated/dataModel.js';
import type { CurrencyCode, Design } from '$lib/types.js';
import { useConvexQuerySubscription } from '$lib/client/convex/use-convex-query-subscription.svelte.js';

export function useDesignQuery() {
	const ludwigChatId = $derived.by(
		() =>
			(page.url.searchParams.get(QueryParams.LUDWIG_CHAT_ID) ?? undefined) as
				| Id<'chats'>
				| undefined
	);

	const { query } = useConvexQuerySubscription(
		api.v1.design.query.getDesignDataByChatId,
		() => ({
			chatId: ludwigChatId!,
			currencyCode: 'USD' as CurrencyCode
		}),
		{
			requiredArgsKeys: ['chatId', 'currencyCode']
		}
	);

	const designQuery = $state({
		get loading() {
			return query.loading;
		},
		get error() {
			return query.error;
		},
		get designProducts() {
			return query.response?.data?.designProducts ?? [];
		},
		get design() {
			return query.response?.data?.design ?? ({} as Design);
		}
	});

	return designQuery;
}

export function useWorkspaceDesignsQuery() {
	const { query } = useConvexQuerySubscription(
		api.v1.design.query.getDesignsByWorkspaceId,
		() => ({
			workspaceId: page.params.workspaceId as Id<'workspaces'>
		}),
		{
			requiredArgsKeys: ['workspaceId']
		}
	);

	const workspaceDesignsQuery = $state({
		get loading() {
			return query.loading;
		},
		get error() {
			return query.error;
		},
		get workspaceDesigns() {
			return query.response?.data ?? [];
		}
	});

	return workspaceDesignsQuery;
}

export function useUniqueDesignSpacesForWorkspaceQuery() {
	const { query } = useConvexQuerySubscription(
		api.v1.design.query.getUniqueDesignSpacesForWorkspace,
		() => ({
			workspaceId: page.params.workspaceId as Id<'workspaces'>
		}),
		{
			requiredArgsKeys: ['workspaceId']
		}
	);

	const uniqueDesignSpacesForWorkspaceQuery = $state({
		get loading() {
			return query.loading;
		},
		get error() {
			return query.error;
		},
		get uniqueSpaces() {
			return query.response?.data ?? [];
		}
	});

	return uniqueDesignSpacesForWorkspaceQuery;
}

export function useDesignTagsForWorkspaceQuery() {
	const { query } = useConvexQuerySubscription(
		api.v1.design.tag.query.getDesignTagsForWorkspace,
		() => ({
			workspaceId: page.params.workspaceId as Id<'workspaces'>
		}),
		{
			requiredArgsKeys: ['workspaceId']
		}
	);

	const designTagsForWorkspaceQuery = $state({
		get loading() {
			return query.loading;
		},
		get error() {
			return query.error;
		},
		get designTags() {
			return query.response?.data ?? [];
		}
	});

	return designTagsForWorkspaceQuery;
}
