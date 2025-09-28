import { page } from '$app/state';
import { asyncTryCatch } from '$lib/utils/try-catch.js';
import { QueryParams } from '$lib/enums.js';
import { onDestroy } from 'svelte';
import type { ChatMessage, ChatMessageDoc, ChatUser } from '$lib/types.js';
import { useUser } from '$lib/client-hooks/use-user.svelte.js';
import autoScroll from '$lib/dom-actions/auto-scroll.js';
import type { Doc, Id } from '../../convex/_generated/dataModel';
import { api } from '../../convex/_generated/api';
import asyncFetch from '$lib/utils/async-fetch';
import { LUDWIG_UI_TOOL_NAMES } from '$lib/constants';
import { goto } from '$app/navigation';
import { useConvexClient } from '$lib/client/convex/use-convex-client.svelte';
import { useConvexQuerySubscription } from '$lib/client/convex/use-convex-query-subscription.svelte';
import { useRouteMutation } from '$lib/client/mutations/use-route.mutation.svelte';

type ChatUsersMetadata = Record<string, ChatUser>;
type ActiveUiToolName = (typeof LUDWIG_UI_TOOL_NAMES)[number];

let autoscroll: ReturnType<typeof autoScroll> | undefined;

const toolLoadingLabels: Record<string, string> = {
	createProject: 'Creating project...',
	updateProject: 'Updating project...',
	getProductCategoriesForDesign: 'Generating product categories...',
	createDesign: 'Creating design...',
	updateDesign: 'Updating design...',
	generateDesignFurnitureRecommendation: 'Generating design furniture recommendation...'
};

export function useLudwigChat() {
	const convexClient = useConvexClient();
	const { appendQueryToRoute } = useRouteMutation();
	const userId = page.data.currentUserId;
	if (!userId) throw new Error('No user ID found');

	const { user } = useUser();

	const currentWorkspaceId = page.params.workspaceId as Id<'workspaces'>;
	const ludwigChatId = $derived.by(
		() =>
			(page.url.searchParams.get(QueryParams.LUDWIG_CHAT_ID) ?? undefined) as
				| Id<'chats'>
				| undefined
	);

	const state = $state({
		prompt: undefined as string | undefined,
		inspoImageUrl: undefined as string | undefined,
		floorPlanUrl: undefined as string | undefined,
		messages: [] as ChatMessageDoc[],
		usersMetadata: {
			[userId]: {
				userId,
				fullName: user?.profile?.fullName,
				imageUrl: user?.profile?.imageUrl
			}
		} as ChatUsersMetadata,
		activeUiToolName: undefined as ActiveUiToolName | undefined,
		loading: true,
		loadingResponse: false,
		isStreaming: false,
		activeToolLoadingLabel: undefined as string | undefined,
		recommendationsAvailable: false,
		error: undefined as string | undefined
	});

	const hasMessageHistory = $derived(state.messages.length > 0);

	$effect(() => {
		if (!ludwigChatId && hasMessageHistory) {
			resetState();
			state.loading = false;
			return;
		}

		if (!ludwigChatId) {
			state.loading = false;
			return;
		}

		if (hasMessageHistory) {
			state.loading = false;
			return;
		}

		loadMessageHistory(ludwigChatId);
	});

	async function loadMessageHistory(ludwigChatId: Id<'chats'>) {
		const { data: response, error } = await asyncTryCatch(() =>
			convexClient.query(api.v1.ludwig.query.getLudwigChatMessages, {
				workspaceId: currentWorkspaceId,
				chatId: ludwigChatId
			})
		);

		if (error) {
			state.error = error.message;
			resetState();
			state.loading = false;
			return;
		}

		state.messages = response?.data.messages ?? [];
		state.activeUiToolName = response?.data.activeUiToolName as ActiveUiToolName | undefined;
		state.usersMetadata =
			response?.data.usersMetadata.reduce<ChatUsersMetadata>((usersMetadata, metadata) => {
				usersMetadata[metadata.userId] = metadata;
				return usersMetadata;
			}, {}) ?? {};

		state.loading = false;
	}

	function resetState() {
		state.messages = [];
		state.loading = false;

		if (userId) state.usersMetadata = { [userId]: state.usersMetadata[userId] };
	}

	useConvexQuerySubscription(
		api.v1.ludwig.query.getLudwigChatResponseStreams,
		() => ({
			workspaceId: currentWorkspaceId,
			chatId: ludwigChatId
		}),
		{
			requiredArgsKeys: ['workspaceId', 'chatId'],
			onData: (response) => onStreamResponse(response.data.map((data) => data.stream)),
			onError: (error) => {
				state.loadingResponse = false;
				state.error = error.message;
				autoscroll?.stop();
			}
		}
	);

	let streamedMessageIndex: number | undefined;
	function onStreamResponse(chatResponseStreams: Doc<'chatResponseStreams'>['stream'][]) {
		if (!userId) return;
		if (!chatResponseStreams) return;
		if (Object.keys(chatResponseStreams[0] ?? {}).length < 1) return;
		let currentStreamedMessage = '';

		state.isStreaming = true;

		for (const chatResponseStream of chatResponseStreams) {
			if (chatResponseStream.type === 'start') state.loadingResponse = true;

			if (chatResponseStream.type === 'tool-input-start')
				state.activeToolLoadingLabel = toolLoadingLabels[chatResponseStream.toolName];

			if (chatResponseStream.type === 'tool-output-available') {
				if (LUDWIG_UI_TOOL_NAMES.includes(chatResponseStream.toolName))
					state.activeUiToolName = chatResponseStream.toolName as ActiveUiToolName;

				if (chatResponseStream.toolName === 'generateDesignFurnitureRecommendation')
					state.recommendationsAvailable = true;
			}

			if (chatResponseStream.type === 'text-delta') {
				state.activeToolLoadingLabel = undefined;
				if (!streamedMessageIndex) {
					const streamedMessageId = window.crypto.randomUUID() as Id<'chatMessages'>;
					state.messages.push({
						id: streamedMessageId,
						userId,
						message: { content: '', role: 'assistant' },
						createdAt: Date.now()
					});

					streamedMessageIndex = state.messages.findIndex(
						(message) => message.id === streamedMessageId
					);
					state.loadingResponse = true;
				}

				currentStreamedMessage += chatResponseStream.delta ?? '';
				state.messages[streamedMessageIndex].message.content = currentStreamedMessage;
			}

			if (chatResponseStream.type === 'finish' || chatResponseStream.type === 'error') {
				state.activeToolLoadingLabel = undefined;
				if (chatResponseStream.type === 'error') state.error = chatResponseStream.errorText;

				streamedMessageIndex = undefined;
				currentStreamedMessage = '';
				state.loadingResponse = false;
				state.isStreaming = false;
				autoscroll?.stop();

				if (state.recommendationsAvailable) {
					setTimeout(() => {
						// eslint-disable-next-line svelte/no-navigation-without-resolve
						goto(`/${currentWorkspaceId}/design?${QueryParams.LUDWIG_CHAT_ID}=${ludwigChatId}`);

						setTimeout(() => {
							state.recommendationsAvailable = false;
						}, 500);
					}, 1000);
				}
			}
		}
	}

	async function sendLudwigChatMessage({
		predefinedPrompt,
		inspoImageUrl,
		floorPlanUrl
	}: {
		predefinedPrompt?: string;
		inspoImageUrl?: string;
		floorPlanUrl?: string;
	}) {
		if (!userId) return;
		if (!state.prompt && !predefinedPrompt) return;
		state.activeUiToolName = undefined;

		state.error = undefined;
		state.loadingResponse = true;

		const userPrompt = (predefinedPrompt ?? state.prompt) as string;
		const userInspoImageUrl = inspoImageUrl ?? state.inspoImageUrl;
		const userFloorPlanUrl = floorPlanUrl ?? state.floorPlanUrl;
		let floorPlanMimeType: string | undefined = undefined;

		const userMessage: ChatMessage = {
			role: 'user',
			content: [{ type: 'text', text: userPrompt }]
		};

		if (userInspoImageUrl)
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(userMessage.content as any[]).push({ type: 'image', image: userInspoImageUrl });
		if (userFloorPlanUrl) {
			const { response, error: fileMediaTypeError } = await asyncFetch.get(
				`/api/file-url/get-content-type?url=${encodeURIComponent(userFloorPlanUrl)}`
			);

			if (fileMediaTypeError) {
				state.error = fileMediaTypeError.message;
				state.loadingResponse = false;
				return;
			}

			const data = await response.json();

			floorPlanMimeType = data.mediaType;

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(userMessage.content as any[]).push({
				type: 'file',
				data: userFloorPlanUrl,
				mediaType: data.mediaType
			});
		}

		state.messages = [
			...state.messages,
			{
				id: window.crypto.randomUUID() as Id<'chatMessages'>,
				userId,
				message: userMessage,
				createdAt: Date.now()
			}
		];

		state.prompt = '';
		state.inspoImageUrl = undefined;
		state.floorPlanUrl = undefined;

		autoscroll?.start();

		const { data: response, error } = await asyncTryCatch(() =>
			convexClient.mutation(api.v1.ludwig.mutation.streamLudwigChatResponse, {
				workspaceId: currentWorkspaceId,
				chatId: ludwigChatId,
				content: userMessage.content,
				inspoImageUrl: userInspoImageUrl,
				floorPlanFile:
					floorPlanMimeType && userFloorPlanUrl
						? {
								url: userFloorPlanUrl,
								mediaType: floorPlanMimeType
							}
						: undefined
			})
		);

		if (error) {
			state.error = error.message;
			state.loadingResponse = false;
			autoscroll?.stop();
			return;
		}

		if (!ludwigChatId) appendQueryToRoute(`${QueryParams.LUDWIG_CHAT_ID}=${response.data.chatId}`);
	}

	async function onSubmitLudwigChatMessage(event: Event) {
		event.preventDefault();

		sendLudwigChatMessage({});
	}

	function chatAutoScroll(node: HTMLElement) {
		autoscroll = autoScroll(node);
	}

	onDestroy(() => {
		autoscroll?.destroy();
	});

	return {
		ludwigChat: state,
		onSubmitLudwigChatMessage,
		sendLudwigChatMessage,
		chatAutoScroll
	};
}
