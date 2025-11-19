<script lang="ts">
	import RingLoader from '$lib/components/loaders/ring-loader.svelte';
	import { cn } from '$lib/utils/cn';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	type ButtonVariant = 'filled' | 'outlined' | 'text';

	let {
		children,
		class: className = '',
		type = 'button',
		variant = 'filled',
		loading = false,
		disabled = false,
		...otherButtonAttributes
	}: { variant?: ButtonVariant; loading?: boolean } & HTMLButtonAttributes = $props();
</script>

<button
	class={cn(
		'relative inline-flex h-12 w-full cursor-pointer items-center justify-center gap-x-2 rounded-md border border-color-action-border-muted px-4 font-medium whitespace-nowrap ring-2 ring-color-focus-ring-muted active:opacity-50 disabled:cursor-not-allowed disabled:border-1 disabled:opacity-50 disabled:ring-0',
		variant === 'filled' && 'bg-color-action-background text-color-action-text',
		variant === 'outlined' && 'bg-transparent',
		variant === 'text' && 'h-fit w-fit rounded-none border-0 px-0 ring-0 disabled:border-0',
		className,
		loading && 'pointer-events-none active:opacity-50'
	)}
	{type}
	disabled={disabled || loading}
	{...otherButtonAttributes}
>
	{@render children?.()}

	{#if loading}
		<RingLoader class="ml-4 fill-color-action-text" />
	{/if}
</button>
