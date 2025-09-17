import { api } from '../../convex/_generated/api.js';
import type { Id } from '../../convex/_generated/dataModel.js';
import { useConvexQuerySubscription } from '$lib/client-hooks/convex.client.svelte.js';
import { page } from '$app/state';
import type { LudwigDesignDetailsResponse } from '$lib/types.js';
import { QueryParams } from '$lib/enums.js';

export function useLudwigChatDesign() {
	const currentWorkspaceId = page.params.workspaceId as Id<'workspaces'>;
	const currentChatId = $derived.by(() => page.url.searchParams.get(QueryParams.LUDWIG_CHAT_ID)) as
		| Id<'chats'>
		| undefined;

	const state = $state({
		designData: {} as LudwigDesignDetailsResponse
	});

	useConvexQuerySubscription(
		api.v1.ludwig.query.getLudwigChatDesignDetails,
		() => ({
			workspaceId: currentWorkspaceId,
			chatId: currentChatId
		}),
		{
			onData: (ludwigDesignDetailsQuery) => {
				state.designData = ludwigDesignDetailsQuery.data;
				console.log('ludwigDesignDetailsQuery', ludwigDesignDetailsQuery.data);
			}
		}
	);

	return {
		ludwigDesignDetails: state
	};
}
