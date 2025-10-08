// import { page } from '$app/state';
// import { QueryParams } from '$lib/enums';
// import { DefaultChatTransport } from 'ai';
// import type { Id } from '../../convex/_generated/dataModel.js';
// import { PUBLIC_LUDWIG_CHAT_URL } from '$env/static/public';
// 	import { Chat } from '@ai-sdk/svelte';

export function useChat() {
	// const userId = page.data.currentUserId;
	// if (!userId) throw new Error('No user ID found');
	// const currentWorkspaceId = page.params.workspaceId as Id<'workspaces'>;
	// const ludwigChatId = $derived(
	// 	(page.url.searchParams.get(QueryParams.LUDWIG_CHAT_ID) ?? undefined) as Id<'chats'> | undefined
	// );
	// const chatTransport = new DefaultChatTransport({
	// 	api: PUBLIC_LUDWIG_CHAT_URL,
	// 	get headers() {
	// 		return {
	// 			Authorization: `Bearer ${page.data.authToken}`,
	// 			'X-Workspace-Id': currentWorkspaceId ?? '',
	// 			'X-Chat-Id': ludwigChatId ?? ''
	// 		};
	// 	}
	// });
	// const chat = new Chat({ transport: chatTransport });
	// 	const productCategoriesBySpaceQuery = $state({
	// 			get chat() {
	// 				return chat;
	// 			},
	// 			get error() {
	// 				return query.error;
	// 			},
	// 			get categories() {
	// 				return query.response?.data ?? [];
	// 			}
	// 		});
	// 		return productCategoriesBySpaceQuery;
}
