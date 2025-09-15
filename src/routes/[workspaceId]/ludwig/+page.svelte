<script lang="ts">
	import FulhausLoader from '$lib/components/loaders/fulhaus-loader.svelte';
	import ChatBackground from '$lib/components/ludwig/chat-background.svelte';
	import ChatForm from '$lib/components/ludwig/chat-form.svelte';
	import StartChat from '$lib/components/ludwig/start-chat.svelte';
	import { useLudwigChat } from '$lib/client-hooks/use-ludwig-chat.svelte';
	import { cn } from '$lib/utils/cn';
	import UserChatMessageCard from '$lib/components/chat/user-chat-message-card.svelte';
	import AiChatMessageCard from '$lib/components/chat/ai-chat-message-card.svelte';
	import LudwigLoader from '$lib/components/loaders/ludwig-loader.svelte';

	const { ludwigChat, chatAutoScroll, onSubmitLudwigChatMessage, sendLudwigChatMessage } =
		useLudwigChat();
	const hasMessages = $derived(ludwigChat.messages.length > 0);
</script>

{#if !ludwigChat.loading && !hasMessages}
	<ChatBackground />
{/if}

<section use:chatAutoScroll class="relative h-full w-full overflow-y-scroll">
	{#if ludwigChat.loading}
		<FulhausLoader class="mx-auto mt-40 size-10" />
	{/if}

	<div
		class={cn(
			'mx-auto h-full w-full max-w-[48rem] opacity-100 transition-opacity duration-500',
			ludwigChat.loading && 'opacity-0'
		)}
	>
		{#if !hasMessages}
			<div class="pt-32 pb-12">
				<StartChat onSelectPredefinedPrompt={sendLudwigChatMessage} />
			</div>
		{/if}

		{#if hasMessages}
			<div class={cn('min-h-full w-full pt-8 pb-[92%]', ludwigChat.isStreaming && 'pb-12')}>
				{#each ludwigChat.messages as { id, userId, message } (id)}
					{#if message?.role === 'user'}
						<UserChatMessageCard {message} user={ludwigChat.usersMetadata[userId]} />
					{/if}

					{#if message?.role === 'assistant'}
						<AiChatMessageCard {message} />
					{/if}
				{/each}

				{#if ludwigChat.loadingResponse}
					<LudwigLoader class="mt-2 ml-2" />
				{/if}
			</div>
		{/if}

		<div class={cn('w-full', hasMessages && 'sticky bottom-0 z-1 bg-color-background pb-2')}>
			<ChatForm
				bind:value={ludwigChat.prompt}
				placeholder={hasMessages ? 'Reply to Ludwig...' : 'Something else?'}
				loading={ludwigChat.loadingResponse}
				onsubmit={onSubmitLudwigChatMessage}
			/>
		</div>
	</div>
</section>
