<script lang="ts">
	import { goto } from '$app/navigation';
	import { useDesignMutation } from '$lib/client/mutations/use-design.mutation.svelte';
	import {
		useDesignTagsForWorkspaceQuery,
		useUniqueDesignSpacesForWorkspaceQuery,
		useWorkspaceDesignsQuery
	} from '$lib/client/queries/use-design.query.svelte';
	import Button from '$lib/components/button.svelte';
	import DesignAddTagPopover from '$lib/components/design/design-add-tag-popover.svelte';
	import Tooltip from '$lib/components/tooltip.svelte';
	import { QueryParams } from '$lib/enums';
	import type { DesignTag, SpaceType } from '$lib/types';
	import { cn } from '$lib/utils/cn';
	import { ArrowRightIcon, LayoutGridIcon, ListIcon, TagsIcon } from '@lucide/svelte';

	type WorkspaceDesignsView = 'grid' | 'list';

	const uniqueDesignSpacesForWorkspaceQuery = useUniqueDesignSpacesForWorkspaceQuery();
	const designTagsForWorkspaceQuery = useDesignTagsForWorkspaceQuery();
	const workspaceDesignsQuery = useWorkspaceDesignsQuery();
	const { deleteDesignTag } = useDesignMutation();

	let activeSpaceType = $state<string>('All');
	let activeSpaceTag = $state<string>('All');
	let workspaceDesignsView = $state<WorkspaceDesignsView>('grid');

	const workspaceUniqueDesignSpaces = $derived.by(
		() => uniqueDesignSpacesForWorkspaceQuery.uniqueSpaces
	);

	const designTagsForWorkspace = $derived.by(() =>
		designTagsForWorkspaceQuery.designTags.toReversed()
	);

	const workspaceDesigns = $derived.by(() => {
		let reversedWorkspaceDesigns = workspaceDesignsQuery.workspaceDesigns.toReversed();
		if (activeSpaceType !== 'All')
			reversedWorkspaceDesigns = reversedWorkspaceDesigns.filter(
				(workspaceDesign) => workspaceDesign.design.spaceType === activeSpaceType
			);

		if (activeSpaceTag !== 'All')
			reversedWorkspaceDesigns = reversedWorkspaceDesigns.filter((workspaceDesign) =>
				workspaceDesign.designTags.some((designTag) => designTag.tag === activeSpaceTag)
			);

		return reversedWorkspaceDesigns;
	});
</script>

<div class={cn('hidden w-full px-4', workspaceDesignsQuery.workspaceDesigns.length > 0 && 'block')}>
	<div class="sticky top-0 z-4 rounded-t-md bg-color-background">
		<div class="flex items-start gap-x-12 px-12">
			<h2 class="py-4 text-2xl leading-none">My Designs</h2>

			<div class="flex-1">
				<div class="flex w-full items-start justify-center gap-x-4 overflow-x-auto px-2 py-4">
					{@render WorkspaceDesignSpaceFilterButton({
						spaceType: 'All',
						imageUrl:
							'https://images.unsplash.com/photo-1574086180165-265509b0d484?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTU4fHxpbnRlcmlvciUyMGRlc2lnbiUyMGFic3RyYWN0JTIwY29sb3JmdWx8ZW58MHx8MHx8fDI%3D'
					})}

					{#each workspaceUniqueDesignSpaces as workspaceUniqueDesignSpace, index (`${index}-${workspaceUniqueDesignSpace.spaceType}`)}
						{@render WorkspaceDesignSpaceFilterButton({
							spaceType: workspaceUniqueDesignSpace.spaceType,
							imageUrl: workspaceUniqueDesignSpace.imageUrl
						})}
					{/each}
				</div>

				{#if designTagsForWorkspace.length > 0}
					<div class="flex w-full items-center justify-center gap-x-2 pt-2 pb-4">
						<div class="flex items-center text-color-text-placeholder">
							<TagsIcon class="size-4" />
							<p class="text-sm font-medium">Tags:</p>
						</div>

						<div class="flex max-w-full items-center gap-x-2 overflow-x-auto px-2 py-1">
							{@render WorkspaceDesignsTagFilterButton('All')}

							{#each designTagsForWorkspace as designTag, index (`${index}-${designTag}`)}
								{@render WorkspaceDesignsTagFilterButton(designTag)}
							{/each}
						</div>
					</div>
				{/if}
			</div>

			<div class="py-4">
				<Tooltip content={workspaceDesignsView === 'grid' ? 'List view' : 'Grid view'}>
					<Button
						variant="text"
						onclick={() =>
							(workspaceDesignsView = workspaceDesignsView === 'grid' ? 'list' : 'grid')}
						class="cursor-pointer"
					>
						{#if workspaceDesignsView === 'grid'}
							<ListIcon />
						{:else}
							<LayoutGridIcon />
						{/if}
					</Button>
				</Tooltip>
			</div>
		</div>
	</div>

	{#if workspaceDesigns.length > 0}
		{#if workspaceDesignsView === 'grid'}
			{@render WorkspaceDesignsGrid()}
		{:else}
			{@render WorkspaceDesignsList()}
		{/if}
	{/if}

	{#if workspaceDesigns.length < 1}
		<div
			class="flex min-h-[calc(100vh-12rem)] justify-center bg-color-background px-8 pt-20 pb-20 text-sm"
		>
			<p class="text-center">No designs matching your filters</p>
		</div>
	{/if}
</div>

{#snippet WorkspaceDesignSpaceFilterButton({
	spaceType,
	imageUrl
}: {
	spaceType: SpaceType | 'All';
	imageUrl: string;
})}
	<button
		class="group block w-16 cursor-pointer space-y-1"
		type="button"
		onclick={() => (activeSpaceType = spaceType)}
	>
		<div
			class={cn(
				'size-16 rounded-full',
				activeSpaceType === spaceType &&
					'ring-2 ring-color-focus-ring ring-offset-1 ring-offset-color-background'
			)}
		>
			<img
				class="size-full rounded-full border border-color-border object-cover"
				src={imageUrl}
				alt={spaceType}
			/>
		</div>

		<p class="line-clamp-1 w-full text-center text-[10px] font-medium group-hover:line-clamp-none">
			{spaceType}
		</p>
	</button>
{/snippet}

{#snippet WorkspaceDesignsTagFilterButton(tagName: string)}
	<Button
		class="h-6 px-2 text-xs font-medium ring-0"
		variant={activeSpaceTag === tagName ? 'filled' : 'outlined'}
		onclick={() => (activeSpaceTag = tagName)}>{tagName}</Button
	>
{/snippet}

{#snippet WorkspaceDesignsGrid()}
	<div
		class="grid min-h-[calc(100vh-12rem)] grid-cols-1 gap-8 bg-color-background px-8 pb-20 text-sm lg:grid-cols-3 2xl:grid-cols-5"
	>
		{#each workspaceDesigns as workspaceDesign (workspaceDesign.design._id)}
			<div class="relative flex flex-col gap-y-4 text-start">
				<button
					class="group relative cursor-pointer"
					type="button"
					onclick={() =>
						goto(
							`/${workspaceDesign.design.workspaceId}/design?${QueryParams.LUDWIG_CHAT_ID}=${workspaceDesign.design.chatId}`
						)}
				>
					<p
						class="absolute top-4 right-4 z-1 hidden h-fit w-fit cursor-pointer rounded-full bg-color-action-background px-2 py-1 text-xs font-medium text-color-action-text group-hover:block"
					>
						<span>View Design</span>
					</p>

					<img
						class="h-88 w-full rounded-md object-cover transition-all duration-700 ease-in-out group-hover:opacity-50"
						src={workspaceDesign.design.renderedImageUrl ??
							workspaceDesign.design.inspirationImageUrl}
						alt={workspaceDesign.design.name}
					/>

					<div class="absolute right-0 bottom-0 left-0 z-1 flex flex-wrap gap-1 p-2">
						{#each workspaceDesign.design.styles ?? [] as style, index (`${index}-${style}`)}
							{@render WorkspaceDesignStyle(style)}
						{/each}
					</div>
				</button>

				<div class="space-y-2 px-2">
					<h4 class="text-lg font-medium">{workspaceDesign.design.name}</h4>

					<div class="flex items-start gap-x-1">
						<p class="text-[10px] font-medium text-color-text-placeholder">Tags:</p>
						<div class="flex flex-1 flex-wrap gap-1">
							{#each workspaceDesign.designTags as designTag (designTag._id)}
								{@render WorkspaceDesignTag(designTag)}
							{/each}

							<DesignAddTagPopover
								designId={workspaceDesign.design._id}
								designTags={workspaceDesign.designTags.map((designTag) => designTag.tag)}
							>
								<p
									class="cursor-pointer rounded-full border border-color-border px-2 py-px text-[10px] font-semibold"
								>
									Add Tag
								</p>
							</DesignAddTagPopover>
						</div>
					</div>

					<!-- <div class="flex items-start gap-x-1">
						<p class="text-[10px] font-medium text-color-text-placeholder">Styles:</p>
						<div class="flex flex-1 flex-wrap gap-1">
							{#each workspaceDesign.design.styles ?? [] as style, index (`${index}-${style}`)}
								{@render WorkspaceDesignStyle(style)}
							{/each}
						</div>
					</div> -->

					<!-- <div class="relative h-8">
						<p
							class="absolute top-0 z-1 line-clamp-2 bg-color-background px-2 text-xs text-color-text-muted group-hover:line-clamp-none group-hover:rounded-b-md group-hover:pb-2"
						>
							{workspaceDesign.design.description}
						</p>
					</div> -->
				</div>
			</div>
		{/each}
	</div>
{/snippet}

{#snippet WorkspaceDesignsList()}
	<div class="min-h-[calc(100vh-12rem)] bg-color-background px-8 pb-20 text-sm">
		<table class="w-full text-left rtl:text-right">
			<thead
				class="border-b border-color-border bg-color-background-surface text-xs text-color-text-placeholder uppercase"
			>
				<tr>
					<th scope="col" class="px-4 py-3"></th>
					<th scope="col" class="px-4 py-3">Name</th>
					<th scope="col" class="px-4 py-3">Tags</th>
					<th scope="col" class="px-4 py-3">Styles</th>
					<th scope="col" class="px-4 py-3"></th>
				</tr>
			</thead>

			<tbody class="text-xs">
				{#each workspaceDesigns as workspaceDesign (workspaceDesign.design._id)}
					<tr
						class="group cursor-pointer border-b border-color-border bg-color-background hover:bg-color-background-surface"
						onclick={() =>
							goto(
								`/${workspaceDesign.design.workspaceId}/design?${QueryParams.LUDWIG_CHAT_ID}=${workspaceDesign.design.chatId}`
							)}
					>
						<td class="w-20 px-4 py-1">
							<img
								class="h-12 w-12 rounded-md border border-color-border object-cover"
								src={workspaceDesign.design.renderedImageUrl ??
									workspaceDesign.design.inspirationImageUrl}
								alt={workspaceDesign.design.name}
							/>
						</td>
						<td class="px-4 py-1 font-medium">{workspaceDesign.design.name}</td>
						<td class="max-w-[24%] px-4 py-1">
							<div class="flex flex-wrap gap-1">
								{#each workspaceDesign.designTags as designTag (designTag._id)}
									{@render WorkspaceDesignTag(designTag)}
								{/each}
							</div>
						</td>
						<td class="max-w-[24%] px-4 py-1">
							<div class="flex flex-wrap gap-1">
								{#each workspaceDesign.design.styles ?? [] as style, index (`${index}-${style}`)}
									{@render WorkspaceDesignStyle(style)}
								{/each}
							</div>
						</td>

						<td class="justify-items-end px-4 py-1 opacity-0 group-hover:opacity-100">
							<ArrowRightIcon />
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/snippet}

{#snippet WorkspaceDesignStyle(style: string)}
	<p
		class="rounded-full bg-color-action-background/50 px-2 py-px text-[10px] font-semibold text-color-action-text"
	>
		{style}
	</p>
{/snippet}

{#snippet WorkspaceDesignTag(designTag: DesignTag)}
	<button
		class="cursor-pointer rounded-full border border-color-action-border bg-color-action-background px-2 py-px text-[10px] font-semibold text-color-action-text hover:border-color-error-border hover:bg-color-error-background hover:text-color-error-text hover:line-through"
		type="button"
		onclick={() => deleteDesignTag(designTag._id)}
	>
		{designTag.tag}
	</button>
{/snippet}
