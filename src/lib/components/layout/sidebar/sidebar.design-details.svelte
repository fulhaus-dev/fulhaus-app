<script lang="ts">
	import type { LudwigDesignDetails, UpdateDesign } from '$lib/types';
	import NoDesignIcon from '$lib/components/svgs/no-design-icon.svelte';
	import { CopyIcon, ImageIcon, MoveRightIcon, PencilLineIcon } from '@lucide/svelte';
	import IconTooltipButton from '$lib/components/icon-tooltip-button.svelte';
	import SidebarDesignEditMode from '$lib/components/layout/sidebar/sidebar.design-edit-mode.svelte';
	import { cn } from '$lib/utils/cn';
	import Button from '$lib/components/button.svelte';
	import { page } from '$app/state';
	import { productCategoryIcons } from '$lib/constants';
	import { useDesign } from '$lib/client-hooks/use-design.svelte';
	import { onMount } from 'svelte';

	type LudwigDesignDetailsProps = {
		design?: LudwigDesignDetails;
	};

	const { design }: LudwigDesignDetailsProps = $props();
	const hasDesign = $derived(!!design?._id);

	let inEditMode = $state(false);

	let updates = $state<UpdateDesign>({});

	const { updateDesign } = useDesign();

	$effect(() => {
		if (design && Object.keys(updates).length < 1)
			updates = {
				name: design.name,
				description: design.description,
				productCategories: design.productCategories,
				inspirationImageUrl: design.inspirationImageUrl,
				floorPlanUrl: design.floorPlanUrl
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
				<div class="flex w-full items-start justify-between gap-x-12">
					<div class="flex-1">
						<div class="flex items-center space-y-1 gap-x-2">
							<ImageIcon class="size-4" />
							<h5 class="font-medium">{design?.name}</h5>
						</div>
						<p class="text-xs text-color-text-muted">{design?.description}</p>
					</div>

					<div class="flex items-center gap-x-4">
						<IconTooltipButton content="Duplicate design" onclick={() => {}}>
							<CopyIcon class="size-4" />
						</IconTooltipButton>

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
					<!-- Product Categories -->
					<div class="space-y-1">
						<h5 class="font-medium">Product Categories</h5>
						<div class="grid w-full grid-cols-2 gap-4 rounded-md p-2">
							{#each design?.productCategories ?? [] as productCategory, i (`${productCategory}-${i}`)}
								<div class="flex w-full gap-x-4">
									<span
										class={cn(
											'text-lg text-color-text-placeholder',
											productCategoryIcons[productCategory]
										)}
									></span>
									<p>
										{productCategory}
									</p>
								</div>
							{/each}
						</div>
					</div>

					<!-- Inspiration Image -->
					<div class="space-y-1">
						<h5 class="font-medium">Inspiration Image</h5>
						<img
							class="h-auto w-full rounded-md object-cover"
							src={design?.inspirationImageUrl}
							alt="Inspiration"
						/>
					</div>

					<!-- Floor plan File -->
					{#if design?.floorPlanUrl}
						<div class="space-y-1">
							<h5 class="font-medium">Floor plan</h5>
							<img
								class="h-auto w-full rounded-md object-cover"
								src={design?.floorPlanUrl}
								alt="Inspiration"
							/>
						</div>
					{/if}
				{/if}

				{#if inEditMode && design}
					<SidebarDesignEditMode spaceType={design.spaceType} bind:updates />
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
							if (design?._id) updateDesign(design._id, updates);
							inEditMode = false;
						}}>Save</Button
					>
				</div>

				{#if page.route.id !== '/[workspaceId]/ludwig'}
					<Button class={cn(inEditMode && 'hidden')}>
						<span class="w-full text-center">Chat with Ludwig</span>
						<MoveRightIcon />
					</Button>
				{/if}
			</div>
		</div>
	</div>
{/if}
