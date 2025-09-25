import { api } from '../../convex/_generated/api.js';
import { useConvexQuerySubscription } from '$lib/client-hooks/convex.client.svelte.js';
import { page } from '$app/state';
import { QueryParams } from '$lib/enums.js';
import type { Id } from '../../convex/_generated/dataModel.js';
import type { Design, DesignProduct } from '$lib/types.js';

export function useDesignPage() {
	const ludwigChatId = $derived.by(
		() =>
			(page.url.searchParams.get(QueryParams.LUDWIG_CHAT_ID) ?? undefined) as
				| Id<'chats'>
				| undefined
	);

	const state = $state({
		designProducts: [] as DesignProduct[],
		design: {} as Design
	});

	useConvexQuerySubscription(
		api.v1.design.query.getDesignDataByChatId,
		() => ({
			chatId: ludwigChatId!
		}),
		{
			requiredArgsKeys: ['chatId'],
			onData: (designProductsQuery) => {
				state.designProducts = designProductsQuery.data.designProducts;
				state.design = designProductsQuery.data.design ?? ({} as Design);
			}
		}
	);

	return {
		designPage: state
	};
}
