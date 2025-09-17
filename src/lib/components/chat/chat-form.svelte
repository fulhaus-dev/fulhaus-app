<script lang="ts">
	import Button from '$lib/components/button.svelte';
	import TextArea from '$lib/components/text-area.svelte';
	import { cn } from '$lib/utils/cn';
	import { SendIcon } from '@lucide/svelte';
	import type { ComponentProps } from 'svelte';

	type ChatFormProps = {
		loading?: boolean;
		onCancel?: () => void;
		onsubmit?: (event: Event) => void;
	} & Omit<ComponentProps<typeof TextArea>, 'onsubmit'>;

	let {
		class: className = '',
		value = $bindable(),
		loading = false,
		onCancel,
		onsubmit,
		...textAreaProps
	}: ChatFormProps = $props();

	function onkeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey) onsubmit?.(event);
	}
</script>

<form class="relative max-h-fit leading-0" {onsubmit}>
	<TextArea
		class={cn(
			'max-h-[40rem] min-h-12 rounded-lg rounded-br-3xl bg-color-background pr-12',
			className
		)}
		placeholder="Ask me anything..."
		bind:value
		{onkeydown}
		{...textAreaProps}
	/>

	{#if loading}
		<Button class="absolute right-1 bottom-1 z-1 size-8 rounded-full p-1.5" onclick={onCancel}>
			<div class="size-full animate-pulse rounded bg-color-background-surface"></div>
		</Button>
	{/if}

	{#if !loading}
		<Button class="absolute right-1 bottom-1 z-1 size-8 rounded-full p-1.5" type="submit">
			<SendIcon class="size-full" />
		</Button>
	{/if}
</form>
