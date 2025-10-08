import { api } from '../../../convex/_generated/api.js';
import type { Id } from '../../../convex/_generated/dataModel.js';
import { page } from '$app/state';
import { asyncTryCatch } from '$lib/utils/try-catch.js';
import { useConvexClient } from '$lib/client/convex/use-convex-client.svelte.js';
import type { FileUIPart } from 'ai';
import asyncFetch from '$lib/utils/async-fetch.js';

export function useChatMutation() {
	const convexClient = useConvexClient();
	const currentWorkspaceId = page.params.workspaceId as Id<'workspaces'> | undefined;

	const state = $state({
		error: undefined as string | undefined
	});

	async function createChat() {
		if (!currentWorkspaceId) return;

		const { data: response, error } = await asyncTryCatch(() =>
			convexClient.mutation(api.v1.chat.mutation.createChat, {
				workspaceId: currentWorkspaceId
			})
		);

		if (error) state.error = error.message;

		return response?.data.chatId;
	}

	async function getChatFileUiPart(fileUrl: string) {
		const { response, error: fileMediaTypeError } = await asyncFetch.get(
			`/api/file-url/get-content-type?url=${encodeURIComponent(fileUrl)}`
		);
		if (fileMediaTypeError) return;

		const data = await response.json();

		const fileMimeType = data.mediaType;

		const fileUiPart: FileUIPart = {
			type: 'file',
			url: fileUrl,
			mediaType: fileMimeType
		};

		return fileUiPart;
	}

	return {
		chatMutationState: state,
		createChat,
		getChatFileUiPart
	};
}
