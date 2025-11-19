<script lang="ts">
	import stringUtil from '$lib/utils/string';
	import type { UIMessage } from 'ai';

	const { uiMessage }: { uiMessage: UIMessage } = $props();

	const aiUiMessage = $derived.by(() => {
		if (uiMessage.role !== 'assistant') return;

		return uiMessage;
	});
</script>

{#if aiUiMessage}
	<div class="space-y-4 p-2">
		{#each aiUiMessage.parts as part, partIndex (`${partIndex}-${aiUiMessage.role}-${aiUiMessage.id}`)}
			{#if part.type === 'text'}
				<p class="prose leading-tight prose-neutral">
					{@html stringUtil.parseMarkdown(part.text)}
				</p>
			{/if}
		{/each}
	</div>
{/if}
