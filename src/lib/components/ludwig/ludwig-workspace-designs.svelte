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
	import SearchInputPopover from '$lib/components/search-input-popover.svelte';
	import Tooltip from '$lib/components/tooltip.svelte';
	import { QueryParams } from '$lib/enums';
	import type { DesignTag, SpaceType } from '$lib/types';
	import { cn } from '$lib/utils/cn';
	import {
		ArrowRightIcon,
		LayoutGridIcon,
		ListIcon,
		SearchIcon,
		Share2Icon,
		TagsIcon,
		Trash2Icon
	} from '@lucide/svelte';
	import type { Id } from '../../../convex/_generated/dataModel';
	import DesignTagButton from '$lib/components/design/design-tag-button.svelte';
	import Checkbox from '$lib/components/checkbox.svelte';
	import DesignSharePopover from '$lib/components/design/design-share-popover.svelte';
	import number from '$lib/utils/number';

	type WorkspaceDesignsView = 'grid' | 'list';

	const uniqueDesignSpacesForWorkspaceQuery = useUniqueDesignSpacesForWorkspaceQuery();
	const designTagsForWorkspaceQuery = useDesignTagsForWorkspaceQuery();
	const workspaceDesignsQuery = useWorkspaceDesignsQuery();
	const { deleteDesignTags, addTagsToDesign, archiveDesigns } = useDesignMutation();

	let activeSpaceType = $state<string>('All');
	let activeSpaceTag = $state<string>('All');
	let workspaceDesignsView = $state<WorkspaceDesignsView>('grid');
	let searchValue = $state<string>();
	let searchIsActive = $state(false);
	let hoveredDesignTags = $state<Id<'designs'>>();
	let openAddDesignTag = $state<Id<'designs'>>();

	let selectedDesignIds = $state<Id<'designs'>[]>([]);

	let activeSharePopoverDesignId = $state<Id<'designs'>>();

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

		if (searchValue)
			reversedWorkspaceDesigns = reversedWorkspaceDesigns.filter((workspaceDesign) =>
				workspaceDesign.design.name.toLowerCase().includes(searchValue!.toLowerCase())
			);

		return reversedWorkspaceDesigns;
	});

	function onSelectDesign(designId: Id<'designs'>, selected: boolean) {
		if (selected) selectedDesignIds = [...selectedDesignIds, designId];
		else selectedDesignIds = selectedDesignIds.filter((id) => id !== designId);
	}
</script>

<div
	class={cn('hidden w-full lg:px-4', workspaceDesignsQuery.workspaceDesigns.length > 0 && 'block')}
>
	<div class="sticky top-0 z-4 w-full rounded-t-md bg-color-background">
		<div class="flex w-full items-start justify-between gap-x-4 px-4 lg:gap-x-12 lg:px-12">
			<h2 class="py-4 text-lg leading-none text-nowrap lg:text-2xl">My Designs</h2>

			<div
				class={cn(
					'fixed right-0 bottom-0 left-0 w-screen border-t  border-color-border bg-color-background lg:relative lg:flex-1 lg:border-0',
					searchIsActive && 'opacity-0 lg:opacity-10',
					selectedDesignIds.length > 0 && 'opacity-0 lg:opacity-100'
				)}
			>
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
					<div class="flex w-full items-center gap-x-2 px-2 pt-2 pb-4 lg:justify-center lg:px-0">
						<div class="hidden items-center text-color-text-placeholder lg:flex">
							<TagsIcon class="size-4" />
							<p class="text-sm font-medium">Tags:</p>
						</div>

						<div class="flex items-center gap-x-2 px-2 py-1">
							{@render WorkspaceDesignsTagFilterButton('All')}

							<div
								class="scrollbar-thin flex max-w-screen flex-1 items-center gap-x-2 overflow-x-auto pr-40 scrollbar-thumb-transparent scrollbar-track-transparent lg:max-w-[1000px] lg:pr-0"
							>
								{#each designTagsForWorkspace as designTag, index (`${index}-${designTag}`)}
									{@render WorkspaceDesignsTagFilterButton(designTag)}
								{/each}
							</div>
						</div>
					</div>
				{/if}
			</div>

			<div class="flex items-center gap-x-4 py-4">
				<Tooltip content="Search designs">
					<SearchInputPopover
						inputClassName="lg:w-[36rem]"
						placeholder="Search designs by name"
						align="end"
						bind:value={searchValue}
						onOpen={(open) => (searchIsActive = open)}
					>
						<SearchIcon />
					</SearchInputPopover>
				</Tooltip>

				<Tooltip
					class="hidden lg:block"
					content={workspaceDesignsView === 'grid' ? 'List view' : 'Grid view'}
				>
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

{#if selectedDesignIds.length > 0}
	<div
		class="fixed right-0 bottom-0 left-0 z-40 flex items-center justify-center gap-x-12 border-t border-color-border bg-color-action-background px-12 py-2 text-sm text-color-action-text"
	>
		<DesignAddTagPopover
			designId={selectedDesignIds[0]}
			designTags={[]}
			onAddTags={(tags) => {
				addTagsToDesign(selectedDesignIds.map((designId) => ({ designId, tagNames: tags })));
				selectedDesignIds = [];
			}}
		>
			<div class="flex items-center gap-x-1">
				<TagsIcon />
				<p class="cursor-pointer font-medium">Add Tag</p>
			</div>
		</DesignAddTagPopover>

		<Button
			class="gap-x-1 text-sm text-red-300"
			variant="text"
			onclick={() => {
				archiveDesigns(selectedDesignIds);
				selectedDesignIds = [];
			}}
		>
			<Trash2Icon />
			<span>
				{selectedDesignIds.length === 1 ? 'Delete Design' : 'Delete Designs'}
			</span>
		</Button>
	</div>
{/if}

{#snippet WorkspaceDesignSpaceFilterButton({
	spaceType,
	imageUrl
}: {
	spaceType: SpaceType | 'All';
	imageUrl: string;
})}
	<button
		class="group block w-12 cursor-pointer space-y-1 lg:w-16"
		type="button"
		onclick={() => (activeSpaceType = spaceType)}
	>
		<div
			class={cn(
				'size-12 rounded-full lg:size-16',
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

		<p
			class="w-full text-center text-[10px] font-medium group-hover:line-clamp-none lg:line-clamp-1"
		>
			{spaceType}
		</p>
	</button>
{/snippet}

{#snippet WorkspaceDesignsTagFilterButton(tagName: string)}
	<Button
		class="h-6 w-fit px-2 text-xs font-medium ring-0"
		variant={activeSpaceTag === tagName ? 'filled' : 'outlined'}
		onclick={() => (activeSpaceTag = tagName)}>{tagName}</Button
	>
{/snippet}

{#snippet WorkspaceDesignsGrid()}
	<div
		class="grid min-h-[calc(100vh-12rem)] grid-cols-1 gap-4 bg-color-background px-2 pt-2 pb-80 text-sm lg:grid-cols-5 lg:px-8 lg:pb-20 2xl:grid-cols-9"
	>
		{#each workspaceDesigns as workspaceDesign (workspaceDesign.design._id)}
			<div class="relative flex flex-col gap-y-1 text-start">
				<div class="group relative cursor-pointer">
					<div class="absolute top-0 right-0 left-0 z-1 flex justify-between overflow-auto p-2">
						<Checkbox
							value={workspaceDesign.design._id}
							checked={selectedDesignIds.includes(workspaceDesign.design._id)}
							onchange={(e) => onSelectDesign(workspaceDesign.design._id, e.currentTarget.checked)}
						/>
					</div>

					<button
						class="relative h-60 w-full cursor-pointer rounded-md"
						type="button"
						onclick={() =>
							goto(
								`/${workspaceDesign.design.workspaceId}/design?${QueryParams.LUDWIG_CHAT_ID}=${workspaceDesign.design.chatId}`
							)}
					>
						<img
							class="h-full w-full rounded-md object-cover transition-all duration-700 ease-in-out"
							src={workspaceDesign.design.renderedImageUrl ??
								workspaceDesign.design.inspirationImageUrl}
							alt={workspaceDesign.design.name}
						/>
					</button>

					<div class="group">
						<Button
							class="absolute top-1/2 left-1/2 z-1 hidden h-fit w-fit -translate-x-1/2 -translate-y-1/2 transform rounded-full px-1.5 py-px text-xs group-hover:flex"
							type="button"
							onclick={() =>
								goto(
									`/${workspaceDesign.design.workspaceId}/design?${QueryParams.LUDWIG_CHAT_ID}=${workspaceDesign.design.chatId}`
								)}
						>
							<span>View Design</span>
						</Button>

						<div
							class={cn(
								'absolute right-2 bottom-2 z-1 hidden group-hover:block',
								activeSharePopoverDesignId === workspaceDesign.design._id && 'block'
							)}
						>
							<DesignSharePopover
								designId={workspaceDesign.design._id}
								onOpenChange={(open) => {
									if (open) activeSharePopoverDesignId = workspaceDesign.design._id;
									else activeSharePopoverDesignId = undefined;
								}}
							>
								<Tooltip content="Share design">
									<div class="size-6 rounded-full bg-color-background p-1 text-xs">
										<Share2Icon class="size-full" />
									</div>
								</Tooltip>
							</DesignSharePopover>
						</div>
					</div>
				</div>

				<div class="space-y-2 px-1">
					<div>
						<h4 class="text-sm font-medium">{workspaceDesign.design.name}</h4>
						<h5 class="text-xs font-medium text-gray-500">
							{number.toMoney(
								workspaceDesign.design.price ?? 0,
								workspaceDesign.design.currencyCode
							)}
						</h5>
					</div>
					<div
						role="group"
						class="flex flex-1 flex-wrap gap-1"
						onmouseenter={() => (hoveredDesignTags = workspaceDesign.design._id)}
						onmouseleave={() => (hoveredDesignTags = undefined)}
						onfocus={() => (hoveredDesignTags = workspaceDesign.design._id)}
						onblur={() => (hoveredDesignTags = undefined)}
					>
						<div class="hidden w-fit flex-wrap gap-1 lg:flex">
							{#each hoveredDesignTags === workspaceDesign.design._id || openAddDesignTag === workspaceDesign.design._id ? workspaceDesign.designTags : workspaceDesign.designTags.slice(0, 2) as designTag (designTag._id)}
								{@render WorkspaceDesignTag(designTag)}
							{/each}

							<DesignAddTagPopover
								designId={workspaceDesign.design._id}
								designTags={workspaceDesign.designTags.map((designTag) => designTag.tag)}
								onOpen={(open) =>
									open
										? (openAddDesignTag = workspaceDesign.design._id)
										: (openAddDesignTag = undefined)}
							>
								<p
									class="cursor-pointer rounded-full border border-color-border px-2 py-px text-[10px] font-semibold"
								>
									Add Tag
								</p>
							</DesignAddTagPopover>
						</div>

						<div class="flex w-fit flex-wrap gap-2 lg:hidden">
							{#each workspaceDesign.designTags as designTag (designTag._id)}
								{@render WorkspaceDesignTag(designTag)}
							{/each}

							<DesignAddTagPopover
								designId={workspaceDesign.design._id}
								designTags={workspaceDesign.designTags.map((designTag) => designTag.tag)}
								onOpen={(open) =>
									open
										? (openAddDesignTag = workspaceDesign.design._id)
										: (openAddDesignTag = undefined)}
							>
								<p
									class="cursor-pointer rounded-full border border-color-border px-2 py-px text-[10px] font-semibold"
								>
									Add Tag
								</p>
							</DesignAddTagPopover>
						</div>
					</div>
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
					<th scope="col" class="px-4 py-3"> </th>
					<th scope="col" class="px-4 py-3"></th>
					<th scope="col" class="px-4 py-3">Name</th>
					<th scope="col" class="px-4 py-3">Price</th>
					<th scope="col" class="px-4 py-3">Tags</th>
					<th scope="col" class="px-4 py-3"></th>
					<th scope="col" class="px-4 py-3"></th>
				</tr>
			</thead>

			<tbody class="text-xs">
				{#each workspaceDesigns as workspaceDesign (workspaceDesign.design._id)}
					<tr
						class="group border-b border-color-border bg-color-background hover:bg-color-background-surface"
					>
						<td class="w-20 px-4 py-1">
							<Checkbox
								value={workspaceDesign.design._id}
								checked={selectedDesignIds.includes(workspaceDesign.design._id)}
								onchange={(e) =>
									onSelectDesign(workspaceDesign.design._id, e.currentTarget.checked)}
							/>
						</td>
						<td class="w-20 px-4 py-1">
							<img
								class="h-12 w-12 rounded-md border border-color-border object-cover"
								src={workspaceDesign.design.renderedImageUrl ??
									workspaceDesign.design.inspirationImageUrl}
								alt={workspaceDesign.design.name}
							/>
						</td>
						<td
							class="cursor-pointer px-4 py-1 font-medium underline-offset-2 group-hover:underline"
							onclick={() =>
								goto(
									`/${workspaceDesign.design.workspaceId}/design?${QueryParams.LUDWIG_CHAT_ID}=${workspaceDesign.design.chatId}`
								)}>{workspaceDesign.design.name}</td
						>

						<td class="px-4 py-1 font-medium">
							{number.toMoney(
								workspaceDesign.design.price ?? 0,
								workspaceDesign.design.currencyCode
							)}</td
						>

						<td class="max-w-[24%] px-4 py-1">
							<div class="flex flex-wrap gap-1">
								{#each workspaceDesign.designTags as designTag (designTag._id)}
									{@render WorkspaceDesignTag(designTag)}
								{/each}
							</div>
						</td>

						<td class="cursor-pointer justify-items-end px-4 py-1">
							<Tooltip content="Share design">
								<DesignSharePopover designId={workspaceDesign.design._id}>
									<div class="size-6 rounded-full bg-color-background p-1 text-xs">
										<Share2Icon class="size-full" />
									</div>
								</DesignSharePopover>
							</Tooltip>
						</td>

						<td
							class="cursor-pointer justify-items-end px-4 py-1 opacity-0 group-hover:opacity-100"
							onclick={() =>
								goto(
									`/${workspaceDesign.design.workspaceId}/design?${QueryParams.LUDWIG_CHAT_ID}=${workspaceDesign.design.chatId}`
								)}
						>
							<ArrowRightIcon />
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/snippet}

{#snippet WorkspaceDesignTag(designTag: DesignTag)}
	<DesignTagButton tag={designTag.tag} onDelete={() => deleteDesignTags([designTag._id])} />
{/snippet}
