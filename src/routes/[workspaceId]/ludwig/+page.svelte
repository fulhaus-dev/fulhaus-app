<script lang="ts">
	import FulhausLoader from '$lib/components/loaders/fulhaus-loader.svelte';
	import LudwigStartChatBackground from '$lib/components/ludwig/ludwig-start-chat-background.svelte';
	import ChatForm from '$lib/components/chat/chat-form.svelte';
	import LudwigStartChat from '$lib/components/ludwig/ludwig-start-chat.svelte';
	import { useLudwigChat } from '$lib/client-hooks/use-ludwig-chat.svelte';
	import { cn } from '$lib/utils/cn';
	import UserChatMessageCard from '$lib/components/chat/user-chat-message-card.svelte';
	import AiChatMessageCard from '$lib/components/chat/ai-chat-message-card.svelte';
	import LudwigChatLoader from '$lib/components/ludwig/ludwig-chat-loader.svelte';
	import LudwigChatFileInputDialog from '$lib/components/ludwig/ludwig-chat-file-input-dialog.svelte';
	import ErrorText from '$lib/components/error-text.svelte';
	import LudwigWorkspaceDesigns from '$lib/components/ludwig/ludwig-workspace-designs.svelte';

	const { ludwigChat, chatAutoScroll, onSubmitLudwigChatMessage, sendLudwigChatMessage } =
		useLudwigChat();
	const hasMessages = $derived(ludwigChat.messages.length > 0);
</script>

{#if !ludwigChat.loading && !hasMessages}
	<LudwigStartChatBackground />
{/if}

<section
	use:chatAutoScroll
	class="relative scrollbar-thin h-full w-full space-y-12 overflow-y-scroll"
>
	{#if ludwigChat.loading}
		<FulhausLoader class="mx-auto mt-40 size-10" />
	{/if}

	<div
		class={cn(
			'mx-auto w-full max-w-[48rem] opacity-100 transition-opacity duration-500',
			ludwigChat.loading && 'opacity-0',
			hasMessages && 'h-full'
		)}
	>
		{#if !hasMessages}
			<div class="pt-32 pb-12">
				<LudwigStartChat
					onSelectPredefinedPrompt={(predefinedPrompt) =>
						sendLudwigChatMessage({ predefinedPrompt })}
					onSelectInspirationImage={(imageUrl) =>
						sendLudwigChatMessage({
							predefinedPrompt: 'Inspiration Image',
							inspoImageUrl: imageUrl
						})}
					onselectFloorPlanImage={(fileUrl) =>
						sendLudwigChatMessage({ predefinedPrompt: 'Floor Plan', floorPlanUrl: fileUrl })}
				/>
			</div>
		{/if}

		{#if hasMessages}
			<div class="min-h-full w-full pt-8 pb-40">
				{#each ludwigChat.messages as { id, userId, message } (id)}
					{#if message?.role === 'user'}
						<UserChatMessageCard {message} user={ludwigChat.usersMetadata[userId]} />
					{/if}

					{#if message?.role === 'assistant'}
						<AiChatMessageCard {message} />
					{/if}
				{/each}

				<div class={cn('mt-4 block', ludwigChat.loadingResponse && 'hidden')}>
					{#if ludwigChat.activeUiToolName === 'provideInspirationImageUI'}
						{@render LudwigChatUiToolInput({ type: 'inspo' })}
					{/if}
					{#if ludwigChat.activeUiToolName === 'provideFloorPlanUI'}
						{@render LudwigChatUiToolInput({ type: 'floorplan' })}
					{/if}
				</div>

				{#if ludwigChat.error && !ludwigChat.loadingResponse}
					<ErrorText error={ludwigChat.error} />
				{/if}

				{#if ludwigChat.loadingResponse}
					<LudwigChatLoader class="mt-2 ml-2" label={ludwigChat.activeToolLoadingLabel} />
				{/if}
			</div>
		{/if}

		<div
			class={cn(
				'w-full transition-all delay-300 ease-in',
				hasMessages && 'sticky bottom-0 z-1 bg-color-background pb-2',
				(ludwigChat.activeUiToolName || ludwigChat.recommendationsAvailable) && 'opacity-0'
			)}
		>
			<ChatForm
				bind:value={ludwigChat.prompt}
				placeholder={hasMessages ? 'Reply to Ludwig...' : 'Something else?'}
				loading={ludwigChat.loadingResponse}
				onsubmit={onSubmitLudwigChatMessage}
			/>
		</div>
	</div>

	{#if !hasMessages}
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
					sendLudwigChatMessage({ predefinedPrompt: 'Inspiration Image', inspoImageUrl: imageUrl })}
			/>
		{/if}

		{#if type === 'floorplan'}
			<LudwigChatFileInputDialog
				{type}
				label="Click to provide a floor plan"
				onSelect={(fileUrl) =>
					sendLudwigChatMessage({ predefinedPrompt: 'Floor Plan', floorPlanUrl: fileUrl })}
			/>
		{/if}
	</div>
{/snippet}
