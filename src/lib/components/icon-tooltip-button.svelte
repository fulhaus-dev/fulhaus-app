<script lang="ts">
	import Tooltip from '$lib/components/tooltip.svelte';
	import { cn } from '$lib/utils/cn';
	import type { Snippet } from 'svelte';

	type IconTooltipButtonProps = {
		children: Snippet;
		class?: string;
		content: string;
		onclick?: () => void;
	};

	const { children, class: className = '', content, onclick }: IconTooltipButtonProps = $props();
</script>

<Tooltip class={cn(className)} {content}>
	<button class="cursor-pointer" type="button" {onclick}>
		{@render children()}
	</button>
</Tooltip>
