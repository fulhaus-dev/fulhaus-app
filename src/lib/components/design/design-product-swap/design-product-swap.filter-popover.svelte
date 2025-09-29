<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { ChevronDown } from '@lucide/svelte';
	import { Popover } from 'bits-ui';
	import type { Snippet } from 'svelte';

	type DesignProductSwapFilterPopoverProps = {
		triggerLabel: string;
		children: Snippet;
	};

	const { triggerLabel, children }: DesignProductSwapFilterPopoverProps = $props();

	let isOpen = $state(false);
</script>

<Popover.Root bind:open={isOpen}>
	<Popover.Trigger
		class="flex h-8 w-fit items-center gap-x-2 rounded-md border border-color-border bg-color-background px-2 text-xs font-medium"
	>
		{triggerLabel}
		<ChevronDown class={cn('size-4 transition-all duration-300', isOpen && 'rotate-180')} />
	</Popover.Trigger>
	<Popover.Portal>
		<Popover.Content
			class="z-50 min-w-fit origin-(--bits-popover-content-transform-origin) rounded-md border border-color-border bg-color-background px-4 py-2 shadow shadow-color-shadow data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
			sideOffset={4}
			align="start"
		>
			{@render children()}
		</Popover.Content>
	</Popover.Portal>
</Popover.Root>
