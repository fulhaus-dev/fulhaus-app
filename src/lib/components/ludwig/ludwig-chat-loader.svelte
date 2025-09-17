<script lang="ts">
	import LudwigLoader from '$lib/components/loaders/ludwig-loader.svelte';
	import { cn } from '$lib/utils/cn';

	type LudwigChatLoaderProps = {
		class?: string;
		label?: string;
	};

	const { class: className = '', label }: LudwigChatLoaderProps = $props();
</script>

<div class={cn('flex items-center gap-x-2 text-sm text-color-text-muted', className)}>
	<LudwigLoader />

	<p class={cn('opacity-0 transition-opacity duration-500 ease-in-out', label && 'opacity-100')}>
		{label}
	</p>
</div>
