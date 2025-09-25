<script lang="ts">
	import LudwigLoader from '$lib/components/loaders/ludwig-loader.svelte';
	import type { DesignProduct } from '$lib/types';
	import { cn } from '$lib/utils/cn';
	import number from '$lib/utils/number';

	type DesignProductViewProps = {
		designProducts: DesignProduct[];
		generatingDesignFurnitureRecommendation: boolean;
	};

	const { designProducts, generatingDesignFurnitureRecommendation }: DesignProductViewProps =
		$props();
</script>

<div class="@container min-h-full w-full">
	<div
		class="grid w-full gap-2 @3xs:grid-cols-2 @5xl:grid-cols-3 @7xl:grid-cols-4 @min-[120rem]:grid-cols-5"
	>
		{#each designProducts as designProduct (designProduct._id)}
			<div
				class="relative flex w-full flex-col gap-y-4 rounded-md border border-color-border-muted bg-color-background p-4"
			>
				<img
					class={cn(
						'h-64 w-full object-contain',
						generatingDesignFurnitureRecommendation && 'animate-pulse'
					)}
					src={designProduct.ludwigImageUrl}
					alt={designProduct.name}
				/>

				<div
					class={cn(
						'flex w-full gap-x-4 rounded-b-md',
						generatingDesignFurnitureRecommendation && 'animate-pulse'
					)}
				>
					<div class="flex-1 space-y-4 text-xs font-medium">
						<div>
							<h3>{designProduct.category}</h3>
							<p class="w-full truncate">
								{designProduct.name}
							</p>
						</div>

						<h5 class="text-3xl">
							{number.toMoney(designProduct.retailPrice, designProduct.currencyCode)}
						</h5>
					</div>
					<div class="h-fit"></div>
				</div>

				{#if generatingDesignFurnitureRecommendation}
					<div
						class="absolute inset-0 z-1 flex flex-col items-center justify-center gap-y-4 rounded-md bg-color-overlay-background/20 text-sm backdrop-blur-xs"
					>
						<LudwigLoader />
						<p>Regenerating furniture recommendation...</p>
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>
