import { api } from '../../../convex/_generated/api.js';
import { page } from '$app/state';
import { QueryParams } from '$lib/enums.js';
import type { Id } from '../../../convex/_generated/dataModel.js';
import type { Design } from '$lib/types.js';
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
			chatId: ludwigChatId!
		}),
		{
			requiredArgsKeys: ['chatId']
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
