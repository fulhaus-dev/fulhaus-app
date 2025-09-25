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

	const workspaceDesigns = $derived(query.response?.data ?? []);
</script>

<div class="w-full p-4">
	<div class="min-h-screen w-full rounded-md bg-color-background p-8">
		<div class="p-4">
			<h2>Your Designs</h2>
		</div>

		<div class="grid grid-cols-1 gap-8 text-sm lg:grid-cols-3 2xl:grid-cols-5">
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

					<img
						class="h-88 w-full rounded-md object-cover transition-all duration-700 ease-in-out group-hover:opacity-50"
						src={workspaceDesign.renderedImageUrl ?? workspaceDesign.inspirationImageUrl}
						alt={workspaceDesign.name}
					/>

					<div class="px-2">
						<h3 class="font-medium">{workspaceDesign.name}</h3>
						<p class="text-xs text-color-text-muted">
							{workspaceDesign.description}
						</p>
					</div>
				</button>
			{/each}
		</div>
	</div>
</div>
