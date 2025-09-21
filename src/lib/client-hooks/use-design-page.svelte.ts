import { api } from '../../convex/_generated/api.js';
import { useConvexQuerySubscription } from '$lib/client-hooks/convex.client.svelte.js';
import { page } from '$app/state';
import { QueryParams } from '$lib/enums.js';
import type { Doc, Id } from '../../convex/_generated/dataModel.js';

export function useDesignPage() {
	const ludwigChatId = $derived.by(
		() =>
			(page.url.searchParams.get(QueryParams.LUDWIG_CHAT_ID) ?? undefined) as
				| Id<'chats'>
				| undefined
	);

	const state = $state({
		designProducts: [] as Doc<'designProducts'>[],
		design: {} as Doc<'designs'>
	});

	useConvexQuerySubscription(
		api.v1.design.product.query.getDesignProductsByChatId,
		() => ({
			chatId: ludwigChatId!
		}),
		{
			requiredArgsKeys: ['chatId'],
			onData: (designProductsQuery) => {
				state.designProducts = designProductsQuery.data.designProducts;
				state.design = designProductsQuery.data.design ?? ({} as Doc<'designs'>);
			}
		}
	);

	return {
		designPage: state
	};
}
