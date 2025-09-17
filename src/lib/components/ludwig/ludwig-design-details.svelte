<script lang="ts">
	import type { LudwigDesignDetails } from '$lib/types';
	import NoDesignIcon from '$lib/components/svgs/no-design-icon.svelte';
	import { ImageIcon } from '@lucide/svelte';

	type LudwigDesignDetailsProps = {
		design?: LudwigDesignDetails;
	};

	const { design }: LudwigDesignDetailsProps = $props();

	const hasDesign = $derived(!!design?._id);
</script>

{#if !hasDesign}
	<div class="flex h-full w-full flex-col items-center justify-center gap-y-2">
		<NoDesignIcon />
		<p class="text-color-text-muted">No Design details yet</p>
	</div>
{/if}

{#if hasDesign}
	<div class="h-full w-full space-y-8 p-4 text-sm">
		<!-- Design details -->
		<div class="w-6/7">
			<div class="flex items-center space-y-1 gap-x-2">
				<ImageIcon />
				<h5 class="font-medium">{design?.name}</h5>
			</div>
			<p class="text-xs text-color-text-muted">{design?.description}</p>
		</div>

		<!-- Product Categories -->
		<div class="space-y-1">
			<h5 class="font-medium">Product Categories</h5>
			<div class="flex flex-wrap gap-2 rounded-md border border-color-border p-2">
				{#each design?.productCategories ?? [] as productCategory, i (`${productCategory}-${i}`)}
					<p>
						{productCategory}
					</p>
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
	</div>
{/if}
