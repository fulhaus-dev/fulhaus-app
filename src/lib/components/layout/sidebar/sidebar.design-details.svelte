<script lang="ts">
	import type { Design, DesignTag, UpdateDesign } from '$lib/types';
	import NoDesignIcon from '$lib/components/svgs/no-design-icon.svelte';
	import { DownloadIcon, MoveRightIcon, PencilLineIcon, RssIcon, Share2Icon } from '@lucide/svelte';
	import IconTooltipButton from '$lib/components/icon-tooltip-button.svelte';
	import SidebarDesignEditMode from '$lib/components/layout/sidebar/sidebar.design-edit-mode.svelte';
	import { cn } from '$lib/utils/cn';
	import Button from '$lib/components/button.svelte';
	import { page } from '$app/state';
	import { productCategoryIcons } from '$lib/constants';
	import { useDesignMutation } from '$lib/client/mutations/use-design.mutation.svelte';
	import { QueryParams } from '$lib/enums';
	import { goto } from '$app/navigation';
	import { useFileMutation } from '$lib/client/mutations/use-file.mutation.svelte';
	import DesignLogs from '$lib/components/design/design-view-sidebar/design-logs.svelte';
	import Tooltip from '$lib/components/tooltip.svelte';
	import DesignSharePopover from '$lib/components/design/design-share-popover.svelte';

	type SidebarDesignDetailsProps = {
		design?: Design;
		hasProducts: boolean;
		designTags: DesignTag[];
	};

	const { design, hasProducts, designTags }: SidebarDesignDetailsProps = $props();
	const hasDesign = $derived(!!design?._id);

	let inEditMode = $state(false);

	let updates = $state<UpdateDesign>({});
	let designTagsToDelete = $state<DesignTag[]>([]);
	let designTagsToAdd = $state<string[]>([]);

	const { addTagsToDesign } = useDesignMutation();
	const { deleteDesignTags } = useDesignMutation();

	const { updateDesign } = useDesignMutation();
	const { downloadFileInBrowser } = useFileMutation();

	$effect(() => {
		if (design)
			updates = {
				name: design.name,
				description: design.description,
				productCategories: design.productCategories,
				inspirationImageUrl: design.inspirationImageUrl,
				floorPlanFileUrl: design.floorPlanFile?.url,
				floorPlanFile: design.floorPlanFile
			};
	});
</script>

{#if !hasDesign}
	<div class="flex h-full w-full flex-col items-center justify-center gap-y-2">
		<NoDesignIcon />
		<p class="text-color-text-muted">No Design details yet</p>
	</div>
{/if}

{#if hasDesign}
	<div class="flex h-full w-full flex-col text-sm">
		<!-- Design details -->
		<div class="w-full bg-color-background px-2 pt-8 pb-4">
			<h5 class={cn('w-full text-center font-medium', !inEditMode && 'hidden')}>Edit Design</h5>

			{#if !inEditMode}
				<div class="flex w-full items-start justify-between gap-x-8">
					<div class="flex-1">
						<div class="flex space-y-1 gap-x-2">
							<!-- <ImageIcon class="size-6" /> -->
							<h5 class="font-medium">
								{design?.name}
							</h5>
						</div>
						<!-- <p class="text-xs text-color-text-muted">{design?.description}</p> -->
					</div>

					<div class="flex items-center gap-x-4">
						<!-- <IconTooltipButton
							content={design?.publishedAt ? 'Unpublish design' : 'Publish design'}
							onclick={() => {}}
						>
							<RssIcon
								class={cn('size-4 text-color-text-muted', design?.publishedAt && 'text-green-500')}
							/>
						</IconTooltipButton>
						<IconTooltipButton content="Duplicate design" onclick={() => {}}>
							<CopyIcon class="size-4" />
						</IconTooltipButton> -->

						{#if design}
							<Tooltip content="Share design">
								<DesignSharePopover designId={design._id}>
									<div class="size-6 rounded-full bg-color-background p-1 text-xs">
										<Share2Icon class="size-full" />
									</div>
								</DesignSharePopover>
							</Tooltip>
						{/if}

						<IconTooltipButton content="Edit design" onclick={() => (inEditMode = true)}>
							<PencilLineIcon class="size-4" />
						</IconTooltipButton>
					</div>
				</div>
			{/if}
		</div>

		<div class="relative scrollbar-thin flex-1 overflow-y-auto">
			<div
				class={cn('min-h-full space-y-8 px-4 pt-4 pb-96', inEditMode && 'min-h-auto pt-0 pb-20')}
			>
				{#if !inEditMode}
					<!-- Design Tags -->
					<div class="space-y-1">
						<h5 class="font-medium">Tags</h5>
						<div class="flex flex-wrap items-center gap-2 p-2">
							{#each designTags as designTag (designTag._id)}
								<p
									class="rounded-full bg-color-action-background px-2 text-[10px] font-semibold text-color-action-text"
								>
									{designTag.tag}
								</p>
							{/each}
						</div>
					</div>

					<!-- Product Categories -->
					<div class="space-y-1">
						<h5 class="font-medium">Product Categories</h5>
						<div class="grid w-full grid-cols-2 gap-4 rounded-md p-2">
							{#each design?.productCategories ?? [] as productCategory, i (`${productCategory}-${i}`)}
								<div class="flex w-full gap-x-4">
									<span
										class={cn(
											'text-lg text-color-text-placeholder',
											productCategoryIcons[productCategory.category]
										)}
									></span>
									<p>
										{productCategory.category}
									</p>
								</div>
							{/each}
						</div>
					</div>

					<!-- Inspiration Image -->
					{#if !!design?.inspirationImageUrl}
						<div class="space-y-1">
							<div class="flex items-center gap-x-2">
								<h5 class="font-medium">Inspiration Image</h5>

								{@render DownloadFileUrlButton({
									label: 'Download inspiration image',
									fileUrl: design.inspirationImageUrl,
									mediaType: 'image/png',
									fileName: `${design.name} inspiration`
								})}
							</div>

							<img
								class="h-auto w-full rounded-md object-cover"
								src={design?.inspirationImageUrl}
								alt="Inspiration"
							/>
						</div>
					{/if}

					<!-- Floor plan File -->
					{#if !!design?.floorPlanFile}
						<div class="space-y-1">
							<div
								class={cn(
									design.floorPlanFile.mediaType.startsWith('image/') && 'flex items-center gap-x-2'
								)}
							>
								<h5 class="font-medium">Floor plan</h5>

								{@render DownloadFileUrlButton({
									label: 'Download floor plan',
									fileUrl: design.floorPlanFile.url,
									mediaType: design.floorPlanFile.mediaType,
									fileName: `${design.name} floor plan`
								})}
							</div>

							{#if design.floorPlanFile.mediaType.startsWith('image/')}
								<img
									class="h-auto w-full rounded-md object-cover"
									src={design?.floorPlanFile.url}
									alt="Inspiration"
								/>
							{/if}
						</div>
					{/if}

					<!-- Design logs -->
					{#if design?._id}
						<div class="space-y-1">
							<h5 class="font-medium">Changes</h5>

							<div class="rounded-md bg-color-background-surface p-2">
								<DesignLogs designId={design._id} />
							</div>
						</div>
					{/if}
				{/if}

				{#if inEditMode && design}
					<SidebarDesignEditMode
						designId={design._id}
						spaceType={design.spaceType}
						bind:updates
						bind:designTagsToAdd
						bind:designTagsToDelete
						{designTags}
					/>
				{/if}
			</div>

			<div
				class="sticky bottom-0 z-1 flex w-full flex-col items-center gap-y-8 bg-color-background p-2"
			>
				<div
					class={cn(
						'flex w-full items-center justify-end gap-x-4 border-t border-color-border p-4 font-medium',
						!inEditMode && 'hidden'
					)}
				>
					<Button class="flex-1" variant="outlined" onclick={() => (inEditMode = false)}
						>Cancel</Button
					>
					<Button
						class="w-[55%]"
						onclick={() => {
							if (design?._id) {
								addTagsToDesign([{ designId: design._id, tagNames: designTagsToAdd }]);
								deleteDesignTags(designTagsToDelete.map((tag) => tag._id));
								updateDesign(design._id, updates);
							}
							inEditMode = false;
						}}>Save</Button
					>
				</div>

				{#if page.route.id !== '/(main)/[workspaceId]/ludwig' && design?.chatId}
					<Button
						class={cn('hidden lg:flex', inEditMode && 'hidden')}
						onclick={() =>
							goto(
								`/${page.params.workspaceId}/ludwig?${QueryParams.LUDWIG_CHAT_ID}=${design.chatId}`
							)}
					>
						<span class="w-full text-center">Chat with Ludwig</span>
						<MoveRightIcon />
					</Button>
				{/if}

				{#if page.route.id === '/(main)/[workspaceId]/ludwig' && design?.chatId && hasProducts}
					<Button
						class={cn(inEditMode && 'hidden')}
						onclick={() =>
							goto(
								`/${page.params.workspaceId}/design?${QueryParams.LUDWIG_CHAT_ID}=${design.chatId}`
							)}
					>
						<span class="w-full text-center">View design</span>
						<MoveRightIcon />
					</Button>
				{/if}
			</div>
		</div>
	</div>
{/if}

{#snippet DownloadFileUrlButton({
	label,
	fileUrl,
	mediaType = 'image/png',
	fileName = 'download'
}: {
	label: string;
	fileUrl: string;
	mediaType?: string;
	fileName?: string;
})}
	<button
		class="flex cursor-pointer items-center gap-x-2 text-xs text-blue-500 underline underline-offset-4"
		type="button"
		onclick={() => downloadFileInBrowser({ fileUrl, fileName })}
	>
		{#if !mediaType.startsWith('image/')}
			<span>{label}</span>
		{/if}

		<IconTooltipButton content={label}>
			<DownloadIcon class="size-4" />
		</IconTooltipButton>
	</button>
{/snippet}
