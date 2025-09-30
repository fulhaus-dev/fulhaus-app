<script lang="ts">
	import { cn } from '$lib/utils/cn';

	type ImageSliderProps = {
		imageUrls: string[];
		productName: string;
	};

	const { imageUrls, productName }: ImageSliderProps = $props();

	let activeImageUrl = $state(imageUrls[0]);
</script>

<div class="flex h-full w-full flex-col gap-y-4">
	<!-- <div class="relative flex w-full flex-1 items-center justify-center">
		{#each imageUrls as src, index (`${productName}-large-image-${index}`)}
			<img
				class={cn(
					'absolute z-1 h-full w-full rounded-md object-contain transition-all duration-500 ease-in-out',
					src === activeImageUrl && 'z-2'
				)}
				{src}
				alt={productName}
			/>
		{/each}
	</div> -->

	<!-- <div class="relative flex w-full flex-1 items-center justify-center">
		{#each imageUrls as src, index (`${productName}-large-image-${index}`)}
			<img
				class={cn(
					'absolute z-1 h-full w-full rounded-md object-contain transition-all duration-500 ease-in-out',
					src === activeImageUrl && 'z-2'
				)}
				{src}
				alt={productName}
			/>
		{/each}
	</div> -->

	<div class="relative w-full flex-1 overflow-x-hidden">
		{#each imageUrls as src, index (`${productName}-large-image-${index}`)}
			{#if src === activeImageUrl}
				<img
					class="absolute h-full w-full animate-in rounded-md object-contain duration-500 ease-out slide-in-from-bottom"
					{src}
					alt={productName}
				/>
			{/if}
		{/each}
	</div>

	<div class="mx-auto flex flex-wrap items-center gap-x-2">
		{#each imageUrls as src, index (`${productName}-image-thumbnail-${index}`)}
			<button
				aria-label="Product image thumbnail button"
				type="button"
				onclick={() => (activeImageUrl = src)}
			>
				<img
					class={cn(
						'size-12 rounded-md border border-color-border object-cover p-px transition-all duration-500 ease-in-out hover:border-color-action-border',
						src === activeImageUrl && 'border-color-action-border'
					)}
					{src}
					alt={`${productName} image ${index + 1}`}
				/>
			</button>
		{/each}
	</div>
</div>
