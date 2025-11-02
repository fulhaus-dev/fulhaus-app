<script lang="ts">
	import { useDesignMutation } from '$lib/client/mutations/use-design.mutation.svelte';
	import Button from '$lib/components/button.svelte';
	import DesignRenderViewerDialog from '$lib/components/design/design-view-sidebar/design-render-viewer-dialog.svelte';
	import DesignViewSidebarCartButton from '$lib/components/design/design-view-sidebar/design-view-sidebar-cart-button.svelte';
	import LudwigLoader from '$lib/components/loaders/ludwig-loader.svelte';
	import type { Design } from '$lib/types';
	import { cn } from '$lib/utils/cn';
	import { SparklesIcon } from '@lucide/svelte';

	type DesignViewSidebarProps = {
		design: Design;
		totalDesignPrice: number;
	};

	const { design, totalDesignPrice }: DesignViewSidebarProps = $props();

	const isSwapRender = $derived(
		(design.renderSwappedProductIds ?? [])?.length > 0 && design.renderingImage
	);

	const { regenerateRender } = useDesignMutation();
</script>

<div class="h-full space-y-4 overflow-y-auto pb-40">
	<div
		class={cn(
			'relative w-full rounded-md leading-0',
			design.renderingImage &&
				!isSwapRender &&
				'flex animate-pulse items-center justify-center border border-color-border bg-color-disabled-background lg:h-60'
		)}
	>
		<DesignRenderViewerDialog
			class={cn('relative w-full cursor-pointer', isSwapRender && 'relative')}
			renderImage={{ src: design.renderedImageUrl ?? design.inspirationImageUrl, alt: design.name }}
		>
			<img
				class={cn(
					'h-auto w-full object-cover lg:max-h-96 lg:rounded-md',
					design.renderingImage && 'hidden',
					isSwapRender && 'block animate-pulse'
				)}
				src={design.renderedImageUrl ?? design.inspirationImageUrl}
				alt={design.name}
			/>

			{#if design.renderingImage}
				<div
					class={cn(
						'space-y-4',
						isSwapRender &&
							'absolute inset-0 flex flex-col items-center justify-center space-y-0 gap-y-4'
					)}
				>
					<LudwigLoader class="mx-auto" />
					<p class="text-xs font-medium text-color-text-muted">
						{`Generating ${design.name} render..`}.
					</p>
				</div>
			{/if}
		</DesignRenderViewerDialog>

		{#if !design.renderingImage}
			<Button
				class="absolute right-2 bottom-2 z-10 h-fit w-fit bg-color-background/80 py-1 text-sm"
				variant="outlined"
				onclick={() => regenerateRender(design._id)}
			>
				<SparklesIcon class="size-4" />
				<span>Regenerate</span>
			</Button>
		{/if}
	</div>

	<div class="space-y-4 px-2">
		<p class="text-sm">{design.description}</p>

		<DesignViewSidebarCartButton
			designId={design._id}
			productIds={design?.productIds ?? []}
			{totalDesignPrice}
		/>
	</div>
</div>
