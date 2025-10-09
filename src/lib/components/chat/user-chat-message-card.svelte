<script lang="ts">
	import Avatar from '$lib/components/avatar.svelte';
	import Button from '$lib/components/button.svelte';
	import type { ChatUser } from '$lib/types';
	import { cn } from '$lib/utils/cn';
	import { ChevronDownIcon } from '@lucide/svelte';
	import type { UIMessage } from 'ai';

	type UserChatMessageCardProps = {
		uiMessage: UIMessage;
		user: ChatUser;
	};

	const { uiMessage, user }: UserChatMessageCardProps = $props();

	const userUiMessage = $derived.by(() => {
		if (uiMessage.role !== 'user') return;

		return uiMessage;
	});

	let messageParagraphRef = $state<HTMLParagraphElement | null>(null);
	const messageIsOverflowing = $derived(
		messageParagraphRef
			? messageParagraphRef.scrollHeight > messageParagraphRef.clientHeight
			: false
	);

	let isExpandCard = $state(false);
</script>

{#if userUiMessage}
	<div
		class={cn(
			'relative mt-12 flex w-fit items-center gap-x-2 rounded-2xl rounded-tr-none bg-color-background-surface p-4',
			messageIsOverflowing ||
				(userUiMessage.parts.some((part) => part.type === 'file') && 'items-start')
		)}
	>
		<Avatar class="size-8" src={user.imageUrl} fullName={user.fullName} />

		<div>
			{#each userUiMessage.parts as part, partIndex (`${partIndex}-${userUiMessage.role}-${userUiMessage.id}`)}
				{#if part.type === 'text'}
					<p>{part.text}</p>
				{/if}

				{#if part.type === 'file'}
					{#if part.mediaType.startsWith('image/')}
						<img
							class="mt-2 h-auto w-48 rounded-md object-cover"
							src={part.url}
							alt={`User chat file`}
						/>
					{/if}
				{/if}
			{/each}
		</div>

		{#if messageIsOverflowing || isExpandCard}
			<Button
				class={cn(
					'absolute right-2 bottom-2 z-1 size-6 rounded-full border-color-border bg-color-background p-0.5 text-color-text ring-0 transition-all delay-150 hover:ring-2 hover:ring-color-focus-ring',
					isExpandCard && 'rotate-180'
				)}
				onclick={() => (isExpandCard = !isExpandCard)}
			>
				<ChevronDownIcon class="size-full" />
			</Button>
		{/if}
	</div>
{/if}
