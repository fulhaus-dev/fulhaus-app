<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { Tooltip } from 'bits-ui';
	import type { Snippet } from 'svelte';

	type TooltipProps = {
		class?: string;
		children: Snippet;
		content: string;
		sideOffset?: number;
	};

	const { class: className = '', children, content, sideOffset = 4 }: TooltipProps = $props();
</script>

<Tooltip.Provider>
	<Tooltip.Root delayDuration={200}>
		<Tooltip.Trigger class={cn('flex cursor-pointer items-center justify-center', className)}>
			{#snippet child({ props })}
				<div {...props}>
					{@render children()}
				</div>
			{/snippet}
		</Tooltip.Trigger>
		<Tooltip.Content class="z-50" {sideOffset}>
			<div
				class="flex items-center justify-center rounded-md border border-color-border-muted bg-color-action-background px-2 py-0.5 text-[10px] font-semibold text-color-action-text shadow-xs shadow-color-shadow-muted outline-hidden"
			>
				{content}
			</div>
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>
