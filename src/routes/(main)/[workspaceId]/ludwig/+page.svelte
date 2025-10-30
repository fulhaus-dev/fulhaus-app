<script lang="ts">
	import ChatForm from '$lib/components/chat/chat-form.svelte';
	import ErrorText from '$lib/components/error-text.svelte';
	import LudwigChatLoader from '$lib/components/ludwig/ludwig-chat-loader.svelte';
	import { useLudwigChatMutation } from '$lib/client/mutations/use-ludwig-chat.mutation.svelte';
	import LudwigChatFileInputDialog from '$lib/components/ludwig/ludwig-chat-file-input-dialog.svelte';
	import { cn } from '$lib/utils/cn';
	import LudwigStartChat from '$lib/components/ludwig/ludwig-start-chat.svelte';
	import LudwigStartChatBackground from '$lib/components/ludwig/ludwig-start-chat-background.svelte';
	import FulhausLoader from '$lib/components/loaders/fulhaus-loader.svelte';
	import UserChatMessageCard from '$lib/components/chat/user-chat-message-card.svelte';
	import AiChatMessageCard from '$lib/components/chat/ai-chat-message-card.svelte';
	import LudwigWorkspaceDesigns from '$lib/components/ludwig/ludwig-workspace-designs.svelte';

	const {
		chatMutationState,
		chat,
		chatAutoScroll,
		onSubmitLudwigChatMessage,
		sendLudwigChatMessage
	} = useLudwigChatMutation();

	const chatIsStreaming = $derived(chat.status === 'streaming' || chat.status === 'submitted');
	const chatHasMessages = $derived(chat.messages.length > 0);

	const currentUiTool = $derived.by(() => {
		const tool = chat.lastMessage?.parts.find((part: any) =>
			part.output?.toolName?.includes('UI')
		) as any;
		if (!tool) return;

		return tool.output?.toolName as string;
	});

	const chatErrorMessage = $derived(chatMutationState.error ?? chat.error?.message);
</script>

{#if !chatMutationState.chatIsLoading && !chatHasMessages}
	<LudwigStartChatBackground />
{/if}

<section
	use:chatAutoScroll
	class="relative scrollbar-thin h-full w-full space-y-12 overflow-y-scroll px-2"
>
	{#if chatMutationState.chatIsLoading}
		<FulhausLoader class="mx-auto mt-40 size-10" />
	{/if}

	<div
		class={cn(
			'mx-auto w-full max-w-[48rem] opacity-100 transition-opacity duration-500',
			chatMutationState.chatIsLoading && 'opacity-0',
			chatHasMessages && 'h-full'
		)}
	>
		{#if !chatHasMessages}
			<div class="pt-12 pb-12 lg:pt-32">
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

		{#if chatHasMessages}
			<div class="min-h-full w-full pt-8 pb-40">
				{#each chat.messages as message (message.id)}
					{#if message?.role === 'user'}
						<UserChatMessageCard
							uiMessage={message}
							user={chatMutationState.chatUsers.find(
								(chatUser) => chatUser.userId === (message.metadata as any)?.userId
							)!}
						/>
					{/if}

					{#if message?.role === 'assistant'}
						<AiChatMessageCard uiMessage={message} />
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

				{#if chatErrorMessage && !chatIsStreaming}
					<ErrorText error={chatErrorMessage} />
				{/if}

				{#if chatIsStreaming}
					<LudwigChatLoader class="mt-2 ml-2" label={chatMutationState.activeToolLoadingLabel} />
				{/if}
			</div>
		{/if}

		<div
			class={cn(
				'w-full transition-all delay-300 ease-in',
				chatHasMessages && 'sticky bottom-0 z-1 bg-color-background pb-2',
				currentUiTool && 'opacity-0'
			)}
		>
			<ChatForm
				bind:value={chatMutationState.userPrompt}
				placeholder={chatHasMessages ? 'Reply to Ludwig...' : 'Something else?'}
				loading={chatIsStreaming}
				onsubmit={onSubmitLudwigChatMessage}
			/>
		</div>
	</div>

	{#if !chatHasMessages}
		<LudwigWorkspaceDesigns />
	{/if}
</section>

{#snippet LudwigChatUiToolInput({ type }: { type: 'inspo' | 'floorplan' })}
	<div class="w-2/5 pl-4">
		{#if type === 'inspo'}
			<LudwigChatFileInputDialog
				{type}
				label="Click to provide an inspiration image"
				onSelect={(imageUrl) =>
					sendLudwigChatMessage({
						message: 'Inspiration Image',
						file: { type: 'inspo', url: imageUrl }
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
