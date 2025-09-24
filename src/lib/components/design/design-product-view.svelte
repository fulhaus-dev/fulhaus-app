<script lang="ts">
	import type { Doc } from '../../../convex/_generated/dataModel';

	const { designProducts }: { designProducts: Doc<'designProducts'>[] } = $props();
</script>

<div class="mx-auto grid w-full grid-cols-4 gap-2">
	{#each designProducts as designProduct (designProduct._id)}
		<div
			class="flex w-full flex-col gap-y-4 rounded-md border border-color-border-muted bg-color-background p-4"
		>
			<img
				class="h-64 w-full object-contain"
				src={designProduct.imageUrl}
				alt={designProduct.name}
			/>

			<div class="flex w-full gap-x-4 rounded-b-md">
				<div class="flex-1 text-xs font-medium">
					<h3>{designProduct.category}</h3>
					<p class="w-full truncate overflow-hidden text-ellipsis">
						{designProduct.name}
					</p>
				</div>
				<div class="h-fit"></div>
			</div>
		</div>
	{/each}
</div>
