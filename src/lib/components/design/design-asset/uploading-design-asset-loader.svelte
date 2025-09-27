<script lang="ts">
	import RingLoader from '$lib/components/loaders/ring-loader.svelte';
	import { cn } from '$lib/utils/cn';

	const { class: className = '' }: { class?: string } = $props();
</script>

<div
	class={cn(
		'absolute inset-0 z-1 flex flex-col items-center gap-y-2 bg-color-background/80 text-sm font-medium',
		className
	)}
>
	<div class="sticky top-40 p-20 text-center">
		<RingLoader class="mx-auto" />
		<p>Uploading</p>
	</div>
</div>
