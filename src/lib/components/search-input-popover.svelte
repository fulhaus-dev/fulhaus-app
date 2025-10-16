<script lang="ts">
	import TextInput from '$lib/components/text-input.svelte';
	import { cn } from '$lib/utils/cn';
	import { Popover } from 'bits-ui';
	import type { Snippet } from 'svelte';

	type SearchInputPopoverProps = {
		children: Snippet;
		inputClassName?: string;
		align?: 'start' | 'center' | 'end';
		placeholder?: string;
		value?: string;
		onOpen?: (open: boolean) => void;
	};

	let {
		children,
		inputClassName,
		align = 'start',
		placeholder = 'Search...',
		value = $bindable(),
		onOpen = () => {}
	}: SearchInputPopoverProps = $props();
</script>

<Popover.Root onOpenChange={onOpen}>
	<Popover.Trigger>{@render children()}</Popover.Trigger>
	<Popover.Portal>
		<Popover.Content
			class="z-50 w-fit origin-(--bits-popover-content-transform-origin) rounded-md border border-color-border bg-color-background shadow shadow-color-shadow data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
			sideOffset={4}
			{align}
			collisionPadding={{ top: 8, right: 8, bottom: 8, left: 8 }}
		>
			<TextInput bind:value {placeholder} class={cn('w-96 bg-transparent', inputClassName)} />
		</Popover.Content>
	</Popover.Portal>
</Popover.Root>
