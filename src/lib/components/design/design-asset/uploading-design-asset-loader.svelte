<script lang="ts">
	import RingLoader from '$lib/components/loaders/ring-loader.svelte';
	import { cn } from '$lib/utils/cn';

	const { class: className = '' }: { class?: string } = $props();
</script>

<div
	class={cn(
		'absolute top-0 right-0 left-0 z-1 flex h-screen max-h-full flex-col items-center justify-center gap-y-2 bg-color-background/80 text-sm font-medium',
		className
	)}
>
	<RingLoader />
	<p>Uploading</p>
</div>
