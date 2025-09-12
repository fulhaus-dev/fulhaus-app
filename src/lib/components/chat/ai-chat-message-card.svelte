<script lang="ts">
	import type { ChatMessage } from '$lib/types';
	import chat from '$lib/utils/chat';
	import stringUtil from '$lib/utils/string';

	const { message }: { message: ChatMessage } = $props();

	const aiMessage = $derived.by(() => {
		if (message.role !== 'assistant') return;

		return chat.getChatMessageContentTexts(message.content);
	});
</script>

{#if aiMessage}
	<div class="p-4">
		<p class="prose leading-tight prose-neutral dark:prose-invert">
			{@html stringUtil.parseMarkdown(aiMessage)}
		</p>
	</div>
{/if}
