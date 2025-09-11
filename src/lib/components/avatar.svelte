<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import stringUtil from '$lib/utils/string';

	let loading = $state(true);
	let image = $state(true);

	type AvatarProps = {
		class?: string;
		src?: string;
		alt?: string;
		fullName?: string;
	};

	const {
		class: className = '',
		src = '',
		alt = 'Avatar',
		fullName = 'N A'
	}: AvatarProps = $props();

	const fallbackText = $derived(stringUtil.getFirstTwoInitials(fullName));
</script>

<div
	class={cn(
		'relative flex size-6 h-auto items-center justify-center rounded-full border border-color-border bg-color-avatar-background p-1 text-xs font-semibold text-color-avatar-text',
		className,
		loading && 'animate-pulse'
	)}
	role="img"
	aria-label={alt}
>
	<img
		class={cn('absolute inset-0 object-cover', (loading || !image) && 'opacity-0')}
		{src}
		{alt}
		loading="lazy"
		decoding="async"
		onload={(l) => (loading = false)}
		onerror={(e) => ((image = false), (loading = false))}
	/>

	<p class={cn((loading || image) && 'opacity-0')}>
		{fallbackText}
	</p>

	{#if loading}
		<span class="sr-only">Loading avatar</span>
	{/if}
</div>
