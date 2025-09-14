<script lang="ts">
	import { Tooltip } from 'bits-ui';
	import type { Snippet } from 'svelte';

	type TooltipProps = {
		class?: string;
		children: Snippet;
		content: string;
		sideOffset?: number;
	};

	const { class: className = '', children, content, sideOffset = 8 }: TooltipProps = $props();
</script>

<Tooltip.Provider>
	<Tooltip.Root delayDuration={200}>
		<Tooltip.Trigger class={className}>
			{@render children()}
		</Tooltip.Trigger>
		<Tooltip.Content {sideOffset}>
			<div
				class="z-0 flex items-center justify-center rounded-md border border-color-border-muted bg-color-background px-2 py-0.5 text-[10px] font-medium shadow-xs shadow-color-shadow-muted outline-hidden"
			>
				{content}
			</div>
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
