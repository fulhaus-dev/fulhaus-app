/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from '../../../convex/_generated/api.js';
import type { Id } from '../../../convex/_generated/dataModel.js';
import { page } from '$app/state';
import { asyncTryCatch } from '$lib/utils/try-catch.js';
import { useConvexClient } from '$lib/client/convex/use-convex-client.svelte.js';
import { DefaultChatTransport, type FileUIPart } from 'ai';
import asyncFetch from '$lib/utils/async-fetch.js';
import { useRouteMutation } from '$lib/client/mutations/use-route.mutation.svelte.js';
import { useUserQuery } from '$lib/client/queries/use-user.query.svelte.js';
import { QueryParams } from '$lib/enums.js';
import { Chat } from '@ai-sdk/svelte';
import { goto } from '$app/navigation';
import type { ChatUser, DesignAssetFileType } from '$lib/types.js';
import autoScroll from '$lib/dom-actions/auto-scroll.js';
import { onDestroy } from 'svelte';

const toolLoadingLabels: Record<string, string> = {
	getProductCategoriesForDesign: 'Generating product categories...',
	createDesign: 'Creating design...',
	updateDesign: 'Updating design...',
	generateDesignFurnitureRecommendation:
		'Generating design furniture recommendation... This might take a minute.'
};

export function useLudwigChatMutation() {
	let autoscroll: ReturnType<typeof autoScroll> | undefined;

	const convexClient = useConvexClient();
	const currentWorkspaceId = page.params.workspaceId as Id<'workspaces'> | undefined;
	const currencyCode = page.data.currencyCode;
	const userQuery = useUserQuery();
	const { updateRouteQuery } = useRouteMutation();

	const chatTransport = new DefaultChatTransport({
		api: `/api/ludwig/stream-chat`,
		get headers() {
			return {
				'X-Workspace-Id': page.params.workspaceId ?? ''
			};
		},
		prepareSendMessagesRequest({ messages }) {
			return {
				body: {
					message: messages[messages.length - 1]
				}
			};
		}
	});

	const chat = new Chat({
		transport: chatTransport,
		onToolCall: ({ toolCall }) => {
			state.currentInputToolName = toolCall.toolName;
			state.activeToolLoadingLabel = toolLoadingLabels[toolCall.toolName];
		}
	});

	const state = $state({
		chatIsLoading: true,
		chatUsers: [] as ChatUser[],
		userPrompt: undefined as string | undefined,
		currentInputToolName: undefined as string | undefined,
		activeToolLoadingLabel: undefined as string | undefined,
		error: undefined as string | undefined
	});

	const ludwigChatId = $derived.by(
		() =>
			(page.url.searchParams.get(QueryParams.LUDWIG_CHAT_ID) ?? undefined) as
				| Id<'chats'>
				| undefined
	);

	const chatIsStreaming = $derived(chat.status === 'streaming' || chat.status === 'submitted');
	const chatHasMessages = $derived(chat.messages.length > 0);

	const designRecommendationIsReady = $derived.by(() => {
		const tool = chat.lastMessage?.parts.find(
			(part: any) => part.output?.toolName === 'generateDesignFurnitureRecommendation'
		) as any;

		if (!tool) return false;
		if (chatIsStreaming) return false;
		if (state.currentInputToolName !== 'generateDesignFurnitureRecommendation') return false;

		return true;
	});

	$effect(() => {
		if (!ludwigChatId && chatHasMessages) {
			resetState();
			return;
		}

		if (!ludwigChatId) {
			resetState();
			return;
		}

		if (chatHasMessages) {
			state.chatIsLoading = false;
			return;
		}

		loadMessageHistory(ludwigChatId);
	});

	$effect(() => {
		if (chat.error || !chatIsStreaming) autoscroll?.stop();
	});

	$effect(() => {
		if (!designRecommendationIsReady) return;

		setTimeout(() => {
			// eslint-disable-next-line svelte/no-navigation-without-resolve
			goto(`/${page.params.workspaceId}/design?${QueryParams.LUDWIG_CHAT_ID}=${ludwigChatId}`);

			resetState();
		}, 1000);
	});

	async function loadMessageHistory(ludwigChatId: Id<'chats'>) {
		if (!currentWorkspaceId) {
			resetState();
			return;
		}

		state.chatIsLoading = true;

		const { data: response, error } = await asyncTryCatch(() =>
			convexClient.query(api.v1.chat.query.getChatUiMessagesAndUsers, {
				workspaceId: currentWorkspaceId,
				chatId: ludwigChatId
			})
		);

		if (error) {
			state.error = error.message;
			resetState();
			return;
		}

		chat.messages = response.messages;
		state.chatUsers = [
			{
				userId: userQuery.userProfile._id,
				fullName: userQuery.userProfile.fullName,
				imageUrl: userQuery.userProfile.imageUrl
			},
			...response.users
		];
		state.chatIsLoading = false;
	}

	function onSubmitLudwigChatMessage(event: Event) {
		event.preventDefault();
		if (!state.userPrompt) return;

		sendLudwigChatMessage({ message: state.userPrompt });
	}

	async function sendLudwigChatMessage({
		message,
		file
	}: {
		message: string;
		file?: {
			type: DesignAssetFileType;
			url: string;
		};
	}) {
		state.error = undefined;
		chat.clearError();
		autoscroll?.start();
		let timeoutMs = 0;

		let chatId = ludwigChatId;
		let files: FileUIPart[] | undefined = undefined;

		if (!ludwigChatId) {
			chatId = await createChat();
			if (!chatId) return;

			updateRouteQuery({ queryString: `${QueryParams.LUDWIG_CHAT_ID}=${chatId}` });
			timeoutMs = 200;
		}

		setTimeout(async () => {
			if (file) {
				const fileUiPart = await getChatFileUiPart(file.url);
				if (!fileUiPart) return;
				if (!fileUiPart.mediaType.includes('image/') && file.type !== 'floorplan') {
					state.error = `File type - ${fileUiPart.mediaType} is not supported.`;
					return;
				}

				files = [fileUiPart];
			}

			chat.sendMessage({
				text: message,
				files,
				metadata: {
					currencyCode,
					chatId,
					userId: userQuery.userProfile._id,
					inspoImageUrl: file?.type === 'inspo' ? file.url : undefined,
					floorPlanFile:
						file?.type === 'floorplan'
							? { url: file.url, mediaType: files?.[0]?.mediaType }
							: undefined,
					spaceImageUrl: file?.type === 'spaceImage' ? file.url : undefined
				}
			});
			state.userPrompt = undefined;
		}, timeoutMs);
	}

	async function createChat() {
		if (!currentWorkspaceId) return;

		const { data: response, error } = await asyncTryCatch(() =>
			convexClient.mutation(api.v1.chat.mutation.createChat, {
				workspaceId: currentWorkspaceId
			})
		);
		if (error) state.error = error.message;

		return response?.chatId;
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

	function chatAutoScroll(node: HTMLElement) {
		autoscroll = autoScroll(node);
	}

	function resetState() {
		chat.messages = [];
		state.chatIsLoading = false;
		state.chatUsers = [];
		state.activeToolLoadingLabel = undefined;
		state.error = undefined;
		state.userPrompt = undefined;
	}

	onDestroy(() => {
		autoscroll?.destroy();
	});

	return {
		chatMutationState: state,
		chat,
		chatAutoScroll,
		onSubmitLudwigChatMessage,
		sendLudwigChatMessage
	};
}
