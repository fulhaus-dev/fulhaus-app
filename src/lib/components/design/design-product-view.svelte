<script lang="ts">
	import type { Doc } from '../../../convex/_generated/dataModel';

	const { designProducts }: { designProducts: Doc<'designProducts'>[] } = $props();
</script>

<div class="mx-auto grid w-full grid-cols-4 gap-2">
	{#each designProducts as designProduct (designProduct._id)}
		<div
			class="flex h-80 w-full flex-col rounded-md border border-color-border-muted bg-color-background-surface"
		>
			<img
				class="h-60 w-full rounded-md object-cover"
				src={designProduct.imageUrl}
				alt={designProduct.name}
			/>

			<div class="h-20 w-full rounded-b-md px-4 py-2 text-xs font-medium">
				<h3 class="text-lg">{designProduct.category}</h3>
				<p>
					{designProduct.name}
				</p>
			</div>
		</div>
	{/each}
</div>
