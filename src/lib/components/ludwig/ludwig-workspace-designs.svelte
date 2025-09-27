<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { useConvexQuerySubscription } from '$lib/client-hooks/convex.client.svelte';
	import { QueryParams } from '$lib/enums';
	import { api } from '../../../convex/_generated/api';
	import type { Id } from '../../../convex/_generated/dataModel';

	const { query } = useConvexQuerySubscription(
		api.v1.design.query.getDesignsByWorkspaceId,
		() => ({
			workspaceId: page.params.workspaceId as Id<'workspaces'>
		}),
		{
			requiredArgsKeys: ['workspaceId']
		}
	);

	const workspaceDesigns = $derived.by(() => (query.response?.data ?? []).toReversed());
</script>

<div class="w-full px-4">
	<div class="sticky top-0 z-4 rounded-t-md bg-color-background px-12 pt-8 pb-4">
		<h2>Your Designs</h2>
	</div>

	<div
		class="grid grid-cols-1 gap-8 bg-color-background px-8 pb-20 text-sm lg:grid-cols-3 2xl:grid-cols-5"
	>
		{#each workspaceDesigns as workspaceDesign (workspaceDesign._id)}
			<button
				class="group relative flex cursor-pointer flex-col gap-y-4 text-start"
				type="button"
				onclick={() =>
					goto(
						`/${workspaceDesign.workspaceId}/design?${QueryParams.LUDWIG_CHAT_ID}=${workspaceDesign.chatId}`
					)}
			>
				<p
					class="absolute top-4 right-4 z-1 hidden rounded-full bg-color-action-background px-4 py-1 text-xs font-semibold text-color-action-text group-hover:block"
				>
					View Design
				</p>

				<div class="relative">
					<img
						class="h-88 w-full rounded-md object-cover transition-all duration-700 ease-in-out group-hover:opacity-50"
						src={workspaceDesign.renderedImageUrl ?? workspaceDesign.inspirationImageUrl}
						alt={workspaceDesign.name}
					/>

					<div class="absolute right-0 bottom-0 left-0 z-1 flex flex-wrap gap-1 p-2">
						{#each workspaceDesign.styles ?? [] as style, index (`${index}-${style}`)}
							<p
								class="rounded-full bg-color-action-background/60 px-2 py-px text-[10px] font-semibold text-color-action-text"
							>
								{style}
							</p>
						{/each}
					</div>
				</div>

				<div>
					<h4 class="px-2 text-lg font-medium">{workspaceDesign.name}</h4>

					<div class="relative h-8">
						<p
							class="absolute top-0 z-1 line-clamp-2 bg-color-background px-2 text-xs text-color-text-muted group-hover:line-clamp-none group-hover:rounded-b-md group-hover:pb-2"
						>
							{workspaceDesign.description}
						</p>
					</div>
				</div>
			</button>
		{/each}
	</div>
</div>
