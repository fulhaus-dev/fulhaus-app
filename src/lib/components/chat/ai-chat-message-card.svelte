<script lang="ts">
	import type { ChatMessage } from '$lib/types';
	import chat from '$lib/utils/chat';
	import stringUtil from '$lib/utils/string';

	const { message }: { message: ChatMessage } = $props();

	const aiMessageContent = $derived.by(() => {
		if (message.role !== 'assistant') return;

		return chat.getChatMessageContent(message.content);
	});
</script>

{#if aiMessageContent}
	<div class="p-4">
		{#each aiMessageContent as content, i (`${content.type}-${i}`)}
			{#if content.type === 'text'}
				<p class="prose leading-tight prose-neutral dark:prose-invert">
					{@html stringUtil.parseMarkdown(content.text)}
				</p>
			{/if}

			{#if content.type === 'image' && typeof (content as any).image === 'string'}
				<img src={(content as any).image} alt="AI chat content" />
			{/if}
		{/each}
	</div>
{/if}
