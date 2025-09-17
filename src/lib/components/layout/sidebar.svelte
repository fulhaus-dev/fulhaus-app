<script lang="ts">
	import { page } from '$app/state';
	import Button from '$lib/components/button.svelte';
	import LudwigDesignDetails from '$lib/components/ludwig/ludwig-design-details.svelte';
	import { QueryParams } from '$lib/enums';
	import { cn } from '$lib/utils/cn';
	import { ChevronLeftIcon, MessageCircleIcon } from '@lucide/svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { useLudwigChatDesign } from '$lib/client-hooks/use-ludwig-chat-design.svelte';
	import type { Id } from '../../../convex/_generated/dataModel';

	const { class: className = '', ...otherSidebarProps }: HTMLAttributes<HTMLElement> = $props();

	const currentChatId = $derived.by(() => page.url.searchParams.get(QueryParams.LUDWIG_CHAT_ID)) as
		| Id<'chats'>
		| undefined;

	const { ludwigDesignDetails } = useLudwigChatDesign();

	const projectDetails = $derived.by(() => ludwigDesignDetails.designData.projectDetails);
	const designDetails = $derived.by(() => ludwigDesignDetails.designData.designDetails);

	const canOpen = $derived(!!currentChatId && !!projectDetails);

	let manuallyCollapsed = $state(false);
</script>

<aside
	class={cn(
		'h-screen overflow-x-hidden border-r border-color-border bg-color-background opacity-100 transition-all duration-300 ease-in-out',
		className,
		manuallyCollapsed ? 'w-12' : 'w-96',
		canOpen ? (manuallyCollapsed ? 'w-12' : 'w-96') : 'w-0 opacity-0'
	)}
	{...otherSidebarProps}
>
	{@render Header()}

	{#if manuallyCollapsed}
		{@render CollapsedSideBar()}
	{/if}

	{#if !manuallyCollapsed}
		{@render ExpandedSideBar()}
	{/if}
</aside>

{#snippet Header()}
	<div
		class={cn(
			'flex h-[2.8rem] w-full items-center gap-x-4 border-b border-color-border pl-2',
			manuallyCollapsed && 'px-0'
		)}
	>
		<h4 class={cn('block flex-1 text-sm font-medium', manuallyCollapsed && 'hidden')}>
			{projectDetails?.name}
		</h4>

		<button
			class={cn(
				'flex h-full cursor-pointer items-center justify-center px-1',
				manuallyCollapsed && 'w-full px-0'
			)}
			type="button"
			onclick={() => (manuallyCollapsed = !manuallyCollapsed)}
		>
			<ChevronLeftIcon
				class={cn('transition-all duration-300', manuallyCollapsed && 'rotate-180')}
			/>
		</button>
	</div>
{/snippet}

{#snippet CollapsedSideBar()}
	<div class="flex h-[calc(100%-2.8rem)] w-full flex-col items-center gap-x-8 py-8">
		<button
			class="flex w-full flex-1 cursor-pointer flex-col items-center gap-x-8"
			type="button"
			onclick={() => (manuallyCollapsed = false)}
		>
			<div class="flex flex-1 items-center justify-center">
				<p
					class="-rotate-90 text-center text-lg font-medium whitespace-nowrap text-color-text-muted"
				>
					Project Summary
				</p>
			</div>
		</button>

		<MessageCircleIcon />
	</div>
{/snippet}

{#snippet ExpandedSideBar()}
	<div class="flex h-[calc(100%-2.8rem)] w-full flex-col items-center">
		<div class="scrollbar-thin flex w-full flex-1 items-center justify-center overflow-y-auto">
			<LudwigDesignDetails design={designDetails} />
		</div>

		<div class="w-full px-4 pb-2">
			<Button>Chat with Ludwig</Button>
		</div>
	</div>
{/snippet}
