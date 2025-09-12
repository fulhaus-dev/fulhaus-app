<script lang="ts">
	import type { ImageData } from '$lib/types';
	import { cn } from '$lib/utils/cn';

	type ImageMasonryProps = {
		class?: string;
		images: ImageData[];
		onSelect?: (imageUrl: string) => void;
	};

	const { class: className = '', images, onSelect }: ImageMasonryProps = $props();
</script>

<div class="@container h-full w-full">
	<div
		class={cn(
			'relative z-0 w-full columns-1 gap-x-0.5 p-0.5 pb-20 md:columns-2 @lg:columns-3 xl:@5xl:columns-5 2xl:@7xl:columns-7',
			className
		)}
	>
		{#each images as image (image.id)}
			<svelte:element
				this={onSelect ? 'button' : 'div'}
				aria-describedby={image.description ? `desc-${image.id}` : undefined}
				role={onSelect ? undefined : null}
				tabindex={onSelect ? undefined : null}
				class="group relative mb-0.5 block h-auto w-full cursor-pointer active:scale-95"
				onclick={() => onSelect?.(image.url)}
			>
				<figure>
					<img
						class="h-auto w-full rounded-md object-cover"
						src={image.url}
						alt={image.description ?? 'No description provided'}
						loading="lazy"
					/>
				</figure>

				{#if image.description}
					<div
						class="absolute right-0 bottom-0 left-0 bg-gradient-to-b from-black/0 via-black/20 to-black/30 px-2 pt-12 pb-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"
					>
						<p class="text-left text-xs font-medium text-white text-shadow-2xs">
							{image.description}
						</p>
					</div>
				{/if}
			</svelte:element>
		{/each}
	</div>
</div>
