<script lang="ts">
	import ChatForm from '$lib/components/chat/chat-form.svelte';
	import { Chat } from '@ai-sdk/svelte';
	import { page } from '$app/state';
	import type { Id } from '../../../convex/_generated/dataModel';
	import { QueryParams } from '$lib/enums';
	import { PUBLIC_LUDWIG_CHAT_URL } from '$env/static/public';
	import { DefaultChatTransport, type FileUIPart } from 'ai';
	import stringUtil from '$lib/utils/string';
	import ErrorText from '$lib/components/error-text.svelte';
	import LudwigChatLoader from '$lib/components/ludwig/ludwig-chat-loader.svelte';
	import { useChatMutation } from '$lib/client/mutations/use-chat.mutation.svelte';
	import { useRouteMutation } from '$lib/client/mutations/use-route.mutation.svelte';
	import LudwigChatFileInputDialog from '$lib/components/ludwig/ludwig-chat-file-input-dialog.svelte';
	import { cn } from '$lib/utils/cn';
	import LudwigStartChat from '$lib/components/ludwig/ludwig-start-chat.svelte';
	import { goto } from '$app/navigation';

	const toolLoadingLabels: Record<string, string> = {
		getProductCategoriesForDesign: 'Generating product categories...',
		createDesign: 'Creating design...',
		updateDesign: 'Updating design...',
		generateDesignFurnitureRecommendation: 'Generating design furniture recommendation...'
	};

	const { updateRouteQuery } = useRouteMutation();
	const { createChat, getChatFileUiPart } = useChatMutation();

	const ludwigChatId = $derived.by(
		() =>
			(page.url.searchParams.get(QueryParams.LUDWIG_CHAT_ID) ?? undefined) as
				| Id<'chats'>
				| undefined
	);

	let userPrompt = $state<string>();
	let activeToolLoadingLabel = $state<string>();

	const chatTransport = new DefaultChatTransport({
		api: PUBLIC_LUDWIG_CHAT_URL,
		get headers() {
			return {
				Authorization: `Bearer ${page.data.authToken}`,
				'X-Workspace-Id': page.params.workspaceId ?? ''
			};
		}
	});

	const chat = new Chat({
		transport: chatTransport,
		onToolCall: ({ toolCall }) => {
			activeToolLoadingLabel = toolLoadingLabels[toolCall.toolName];
		}
	});
	const chatIsStreaming = $derived(chat.status === 'streaming' || chat.status === 'submitted');
	const hasMessages = $derived(chat.messages.length > 0);

	const currentUiTool = $derived.by(() => {
		const tool = chat.lastMessage?.parts.find((part: any) =>
			part.output?.toolName?.includes('UI')
		) as any;
		if (!tool) return;

		return tool.output?.toolName as string;
	});

	const designRecommendationIsReady = $derived.by(() => {
		const tool = chat.lastMessage?.parts.find(
			(part: any) => part.output?.toolName === 'generateDesignFurnitureRecommendation'
		) as any;
		if (!tool) return false;

		if (chatIsStreaming) return false;

		return true;
	});

	function handleSubmit(event: Event) {
		event.preventDefault();
		if (!userPrompt) return;

		sendLudwigChatMessage({ message: userPrompt });
	}

	$effect(() => {
		if (designRecommendationIsReady)
			goto(`/${page.params.workspaceId}/design?${QueryParams.LUDWIG_CHAT_ID}=${ludwigChatId}`);
	});

	async function sendLudwigChatMessage({
		message,
		file
	}: {
		message: string;
		file?: {
			type: 'inspo' | 'floorplan';
			url: string;
		};
	}) {
		chat.clearError();

		let chatId = ludwigChatId;
		let files: FileUIPart[] | undefined = undefined;

		if (!ludwigChatId) {
			chatId = await createChat();
			if (!chatId) return;

			updateRouteQuery({ queryString: `${QueryParams.LUDWIG_CHAT_ID}=${chatId}` });
		}

		if (file) {
			const fileUiPart = await getChatFileUiPart(file.url);
			if (!fileUiPart) return;

			files = [fileUiPart];
		}

		chat.sendMessage({
			text: message,
			files,
			metadata: {
				chatId,
				inspoImageUrl: file?.type === 'inspo' ? file.url : undefined,
				floorPlanFile:
					file?.type === 'floorplan'
						? { url: file.url, mediaType: files?.[0]?.mediaType }
						: undefined
			}
		});
		userPrompt = undefined;
	}

	$inspect(chat.messages);
	$inspect('currentUiTool', currentUiTool);
</script>

<section class="relative scrollbar-thin h-full w-full space-y-12 overflow-y-scroll">
	<div class="mx-auto h-full w-full max-w-[48rem] opacity-100 transition-opacity duration-500">
		{#if !hasMessages}
			<div class="pt-32 pb-12">
				<LudwigStartChat
					onSelectPredefinedPrompt={(predefinedPrompt) =>
						sendLudwigChatMessage({ message: predefinedPrompt })}
					onSelectInspirationImage={(imageUrl) =>
						sendLudwigChatMessage({
							message: 'Inspiration Image',
							file: { type: 'inspo', url: imageUrl }
						})}
					onselectFloorPlanImage={(fileUrl) =>
						sendLudwigChatMessage({
							message: 'Floor Plan',
							file: { type: 'floorplan', url: fileUrl }
						})}
				/>
			</div>
		{/if}

		{#if hasMessages}
			<div class="min-h-full w-full pt-8 pb-40">
				{#each chat.messages as message (message.id)}
					{#if message?.role === 'user'}
						<div class="bg-stone-200 px-4 py-2">
							{#each message.parts as part, partIndex (partIndex)}
								{#if part.type === 'text'}
									<p>{part.text}</p>
								{/if}
							{/each}
						</div>
					{/if}

					{#if message?.role === 'assistant'}
						<div class="pt-2 pb-12">
							{#each message.parts as part, partIndex (partIndex)}
								{#if part.type === 'text'}
									<p class="prose prose-sm leading-tight prose-stone">
										{@html stringUtil.parseMarkdown(part.text)}
									</p>
								{/if}
							{/each}
						</div>
					{/if}
				{/each}

				<div class={cn('mt-4 block', chatIsStreaming && 'hidden')}>
					{#if currentUiTool === 'provideInspirationImageUI'}
						{@render LudwigChatUiToolInput({ type: 'inspo' })}
					{/if}
					{#if currentUiTool === 'provideFloorPlanUI'}
						{@render LudwigChatUiToolInput({ type: 'floorplan' })}
					{/if}
				</div>

				{#if chat.error && !chatIsStreaming}
					<ErrorText error={chat.error.message} />
				{/if}

				{#if chatIsStreaming}
					<LudwigChatLoader class="mt-2 ml-2" label={activeToolLoadingLabel} />
				{/if}
			</div>
		{/if}

		<div
			class={cn(
				'w-full transition-all delay-300 ease-in',
				hasMessages && 'sticky bottom-0 z-1 bg-color-background pb-2'
			)}
		>
			<ChatForm
				bind:value={userPrompt}
				placeholder={chat.messages.length > 0 ? 'Reply to Ludwig...' : 'Something else?'}
				loading={chatIsStreaming}
				onsubmit={handleSubmit}
			/>
		</div>
	</div>
</section>

{#snippet LudwigChatUiToolInput({ type }: { type: 'inspo' | 'floorplan' })}
	<div class="w-2/5 pl-4">
		{#if type === 'inspo'}
			<LudwigChatFileInputDialog
				{type}
				label="Click to provide an inspiration image"
				onSelect={(fileUrl) =>
					sendLudwigChatMessage({
						message: 'Inspiration Image',
						file: { type: 'inspo', url: fileUrl }
					})}
			/>
		{/if}

		{#if type === 'floorplan'}
			<LudwigChatFileInputDialog
				{type}
				label="Click to provide a floor plan"
				onSelect={(fileUrl) =>
					sendLudwigChatMessage({
						message: 'Floor Plan',
						file: { type: 'floorplan', url: fileUrl }
					})}
			/>
		{/if}
	</div>
{/snippet}
