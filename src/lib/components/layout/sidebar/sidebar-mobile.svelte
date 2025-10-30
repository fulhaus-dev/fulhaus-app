<script lang="ts">
	import { page } from '$app/state';
	import SidebarDesignDetails from '$lib/components/layout/sidebar/sidebar.design-details.svelte';
	import { QueryParams } from '$lib/enums';
	import { cn } from '$lib/utils/cn';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Id } from '../../../../convex/_generated/dataModel';
	import { useDesignQuery } from '$lib/client/queries/use-design.query.svelte';

	type SidebarMobileProps = { open?: boolean; onClose?: () => void } & HTMLAttributes<HTMLElement>;

	const {
		class: className = '',
		open = false,
		onClose = () => {},
		...otherSidebarProps
	}: SidebarMobileProps = $props();

	const currentChatId = $derived.by(() => page.url.searchParams.get(QueryParams.LUDWIG_CHAT_ID)) as
		| Id<'chats'>
		| undefined;

	const designQuery = useDesignQuery();

	const canOpen = $derived(!!currentChatId && !!designQuery.design?._id);
</script>

{#if canOpen}
	<aside
		class={cn(
			'fixed inset-0 z-40 h-screen w-screen overflow-x-hidden bg-color-background',
			className,
			open ? 'block' : 'hidden',
			'lg:hidden'
		)}
		{...otherSidebarProps}
	>
		<div class="h-full w-full pb-[2.8rem]">
			<SidebarDesignDetails
				design={designQuery.design}
				hasProducts={(designQuery.designProducts ?? []).length > 0}
			/>
		</div>
	</aside>
{/if}
