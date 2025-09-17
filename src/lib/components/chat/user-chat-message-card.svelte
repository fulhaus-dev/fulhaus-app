<script lang="ts">
	import Avatar from '$lib/components/avatar.svelte';
	import Button from '$lib/components/button.svelte';
	import type { ChatUser } from '$lib/types';
	import { cn } from '$lib/utils/cn';
	import { ChevronDownIcon } from '@lucide/svelte';
	import type { Doc } from '../../../convex/_generated/dataModel';
	import chat from '$lib/utils/chat';

	type UserChatMessageCardProps = {
		message: Doc<'chatMessages'>['message'];
		user: ChatUser;
	};

	const { message, user }: UserChatMessageCardProps = $props();

	const userMessageContent = $derived.by(() => {
		if (message.role !== 'user') return;

		return chat.getChatMessageContent(message.content);
	});

	let messageParagraphRef = $state<HTMLParagraphElement | null>(null);
	const messageIsOverflowing = $derived(
		messageParagraphRef
			? messageParagraphRef.scrollHeight > messageParagraphRef.clientHeight
			: false
	);

	let isExpandCard = $state(false);
</script>

{#if userMessageContent}
	<div
		class={cn(
			'relative mt-12 flex w-fit items-center gap-x-2 rounded-2xl rounded-tr-none bg-color-background-surface p-4',
			messageIsOverflowing ||
				(userMessageContent.some((content) => content.type === 'image') && 'items-start')
		)}
	>
		<Avatar class="size-8" src={user.imageUrl} fullName={user.fullName} />

		<div>
			{#each userMessageContent as content, i (`${content.type}-${i}`)}
				{#if content.type === 'text'}
					<p
						bind:this={messageParagraphRef}
						class={cn(
							'max-h-20 max-w-fit flex-1 overflow-hidden text-ellipsis transition-all',
							isExpandCard && 'max-h-auto'
						)}
					>
						{content.text}
					</p>
				{/if}

				{#if (content.type === 'image' && typeof (content as any).image === 'string') || (content.type === 'file' && typeof (content as any).data === 'string' && (content as any).mediaType.startsWith('image/'))}
					<img
						class="mt-2 h-auto w-48 rounded-md object-cover"
						src={(content as any).image ?? (content as any).data}
						alt="user chat file"
					/>
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
