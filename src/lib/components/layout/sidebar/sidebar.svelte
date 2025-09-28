<script lang="ts">
	import { page } from '$app/state';
	import SidebarDesignDetails from '$lib/components/layout/sidebar/sidebar.design-details.svelte';
	import { QueryParams } from '$lib/enums';
	import { cn } from '$lib/utils/cn';
	import { ChevronsLeftIcon, MessageCircleIcon, PlusIcon } from '@lucide/svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { useLudwigChatDesign } from '$lib/client-hooks/use-ludwig-chat-design.svelte';
	import type { Id } from '../../../../convex/_generated/dataModel';
	import SidebarProjectDropdownMenu from '$lib/components/layout/sidebar/sidebar.project-dropdown-menu.svelte';
	import Tooltip from '$lib/components/tooltip.svelte';

	const { class: className = '', ...otherSidebarProps }: HTMLAttributes<HTMLElement> = $props();

	const currentChatId = $derived.by(() => page.url.searchParams.get(QueryParams.LUDWIG_CHAT_ID)) as
		| Id<'chats'>
		| undefined;

	const { ludwigDesignDetails } = useLudwigChatDesign();

	const projectDetails = $derived.by(() => ludwigDesignDetails.designData.projectDetails);
	const designDetails = $derived.by(() => ludwigDesignDetails.designData.designDetails);

	const canOpen = $derived(!!currentChatId && !!projectDetails?._id);

	let manuallyCollapsed = $state(false);
</script>

<aside
	class={cn(
		'h-full overflow-x-hidden border-r border-color-border bg-color-background opacity-100 transition-all duration-300 ease-in-out',
		className,
		manuallyCollapsed ? 'w-12' : 'w-96',
		!canOpen && 'w-0 opacity-0'
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
			'relative z-1 flex h-[2.8rem] w-96 items-center gap-x-4 border-b border-color-border pl-2',
			manuallyCollapsed && 'w-full px-0'
		)}
	>
		{#if projectDetails}
			<SidebarProjectDropdownMenu
				class={cn('flex-1 text-start', manuallyCollapsed && 'hidden')}
				ludwigProjectDetails={projectDetails}
			/>
		{/if}

		<div
			class={cn('flex w-fit items-center justify-center gap-x-2', manuallyCollapsed && 'w-full')}
		>
			<Tooltip class={cn('px-1', manuallyCollapsed && 'hidden')} content="Start New Project">
				<button type="button">
					<PlusIcon />
				</button>
			</Tooltip>

			<Tooltip
				class={cn(
					'flex h-full cursor-pointer items-center justify-center px-1',
					manuallyCollapsed && 'w-full px-0'
				)}
				content={manuallyCollapsed ? 'Expand' : 'Collapse'}
			>
				<button type="button" onclick={() => (manuallyCollapsed = !manuallyCollapsed)}>
					<ChevronsLeftIcon
						class={cn(
							'text-color-text-muted transition-all duration-300',
							manuallyCollapsed && 'rotate-180'
						)}
					/>
				</button>
			</Tooltip>
		</div>
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
	<div class="relative h-[calc(100%-2.8rem)] w-96">
		<!-- <div class="sticky top-0 z-1 w-full bg-color-background px-2 pt-4 text-xs font-medium">
			<div class="border-b border-color-border">
				<h6>Designs</h6>
			</div>
		</div> -->

		<div class="h-full w-full">
			<SidebarDesignDetails design={designDetails} />
		</div>
	</div>
{/snippet}
