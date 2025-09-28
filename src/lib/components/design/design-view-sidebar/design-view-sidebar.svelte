<script lang="ts">
	import Button from '$lib/components/button.svelte';
	import DesignRenderViewerDialog from '$lib/components/design/design-view-sidebar/design-render-viewer-dialog.svelte';
	import DesignViewSidebarCartButton from '$lib/components/design/design-view-sidebar/design-view-sidebar-cart-button.svelte';
	import LudwigLoader from '$lib/components/loaders/ludwig-loader.svelte';
	import type { Design } from '$lib/types';
	import { cn } from '$lib/utils/cn';
	import { SparklesIcon } from '@lucide/svelte';

	const { design }: { design: Design } = $props();
</script>

<div class="space-y-4">
	<div
		class={cn(
			'h-60 w-full rounded-md',
			design.renderingImage &&
				'flex animate-pulse items-center justify-center border border-color-border bg-color-disabled-background'
		)}
	>
		<DesignRenderViewerDialog
			class="h-full w-full cursor-pointer"
			renderImage={{ src: design.renderedImageUrl ?? design.inspirationImageUrl, alt: design.name }}
		>
			<img
				class={cn('h-full w-full rounded-md object-cover', design.renderingImage && 'hidden')}
				src={design.renderedImageUrl ?? design.inspirationImageUrl}
				alt={design.name}
			/>

			{#if design.renderingImage}
				<div class="space-y-4">
					<LudwigLoader class="mx-auto" />
					<p class="text-xs font-medium text-color-text-muted">
						{`Generating ${design.name} render..`}.
					</p>
				</div>
			{/if}
		</DesignRenderViewerDialog>
	</div>

	<div class="space-y-4 px-2">
		<p class="text-sm">{design.description}</p>

		<div class="space-y-4">
			<Button variant="outlined">
				<SparklesIcon class="size-4" />
				<span>Regenerate</span>
			</Button>

			<DesignViewSidebarCartButton productIds={design?.productIds ?? []} />
		</div>
	</div>
</div>
