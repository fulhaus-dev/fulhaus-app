<script lang="ts">
	import { Popover } from 'bits-ui';
	import type { Snippet } from 'svelte';
	import type { Id } from '../../../convex/_generated/dataModel';
	import { PUBLIC_APP_URL } from '$env/static/public';
	import Button from '$lib/components/button.svelte';
	import { Link2Icon } from '@lucide/svelte';
	import { asyncTryCatch } from '$lib/utils/try-catch';
	import { page } from '$app/state';
	import { QueryParams } from '$lib/enums';

	type DesignSharePopoverProps = {
		designId: Id<'designs'>;
		children: Snippet;
		align?: 'start' | 'center' | 'end';
	};

	let { designId, children, align = 'center' }: DesignSharePopoverProps = $props();
	let shareLink = $derived(
		`${PUBLIC_APP_URL}/design/s/${designId}?${QueryParams.DESIGN_CURRENCY_CODE}=${page.data.currencyCode}`
	);

	let shareLinkCopiedToClipboard = $state(false);

	async function copyShareLinkToClipboard() {
		const { error } = await asyncTryCatch(() => navigator.clipboard.writeText(shareLink));
		if (!error) shareLinkCopiedToClipboard = true;
	}
</script>

<Popover.Root>
	<Popover.Trigger>{@render children()}</Popover.Trigger>
	<Popover.Portal>
		<Popover.Content
			class="z-50 w-[80vw] origin-(--bits-popover-content-transform-origin) rounded-md border border-color-border bg-color-background-surface shadow shadow-color-shadow data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 lg:w-[28rem]"
			sideOffset={4}
			{align}
			collisionPadding={{ top: 8, right: 8, bottom: 8, left: 8 }}
		>
			<div class="flex w-full items-center gap-x-4 text-xs font-medium">
				<p
					class="scrollbar-thin flex-1 overflow-x-auto px-2 text-color-text-muted scrollbar-thumb-transparent scrollbar-track-transparent"
				>
					{`${PUBLIC_APP_URL}/design/${designId}`}
				</p>
				<Button
					class="h-fit w-fit px-2 py-1 text-xs lg:text-sm"
					disabled={shareLinkCopiedToClipboard}
					onclick={copyShareLinkToClipboard}
				>
					<Link2Icon class="size-4 -rotate-45 lg:size-6" />

					{#if shareLinkCopiedToClipboard}
						<span>Copied!</span>
					{:else}
						<span>Copy Link</span>
					{/if}
				</Button>
			</div>
		</Popover.Content>
	</Popover.Portal>
</Popover.Root>
