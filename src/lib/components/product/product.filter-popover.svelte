<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { ChevronDown } from '@lucide/svelte';
	import { Popover } from 'bits-ui';
	import type { Snippet } from 'svelte';

	type ProductFilterPopoverProps = {
		open?: boolean;
		triggerLabel: string;
		children: Snippet;
		hasFilter: boolean;
		aFilterIsOpen?: boolean;
	};

	let {
		triggerLabel,
		children,
		hasFilter,
		open = $bindable(false),
		aFilterIsOpen = false
	}: ProductFilterPopoverProps = $props();

	let isOpen = $state(false);
</script>

<Popover.Root bind:open>
	<Popover.Trigger
		class={cn(
			'flex h-8 w-fit items-center gap-x-2 rounded-md border border-color-border bg-color-background px-2 text-xs font-medium',
			hasFilter && 'bg-color-action-background text-color-action-text',
			aFilterIsOpen && !open && 'opacity-20'
		)}
	>
		{triggerLabel}
		<ChevronDown class={cn('size-4 transition-all duration-300', isOpen && 'rotate-180')} />
	</Popover.Trigger>
	<Popover.Portal>
		<Popover.Content
			class="z-50 min-w-fit origin-(--bits-popover-content-transform-origin) rounded-md border border-color-border bg-color-background shadow shadow-color-shadow data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
			sideOffset={4}
			align="start"
			collisionPadding={{ top: 8, right: 8, bottom: 8, left: 8 }}
		>
			{@render children()}
		</Popover.Content>
	</Popover.Portal>
</Popover.Root>
