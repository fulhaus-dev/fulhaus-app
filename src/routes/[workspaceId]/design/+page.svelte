<script lang="ts">
	import { useDesignPage } from '$lib/client-hooks/use-design-page.svelte';
	import Button from '$lib/components/button.svelte';
	import DesignProductView from '$lib/components/design/design-product-view.svelte';
	import { cn } from '$lib/utils/cn';
	import { ArmchairIcon, PaletteIcon, ShoppingCartIcon, SparklesIcon } from '@lucide/svelte';

	type DesignView = 'product' | 'canvas';

	let activeDesignView = $state<DesignView>('product');

	const { designPage } = useDesignPage();

	const design = $derived(designPage.design);
	const designProducts = $derived(designPage.designProducts);
</script>

<section class="relative -mt-px h-full w-full overflow-y-auto border-t border-color-border">
	<div class="sticky top-0 z-2 flex h-[2.8rem] items-center bg-color-background/80 px-8">
		<h4 class="flex-1 text-sm font-medium">{design.name}</h4>

		<div class="flex flex-1 items-center justify-center">
			<Button
				class="h-[1.6rem] w-40 rounded-sm text-xs transition-all duration-300"
				onclick={() =>
					activeDesignView === 'product'
						? (activeDesignView = 'canvas')
						: (activeDesignView = 'product')}
			>
				{#if activeDesignView === 'product'}
					<PaletteIcon class="size-4" />
				{:else}
					<ArmchairIcon class="size-4" />
				{/if}

				<span>{activeDesignView === 'product' ? 'Canvas View' : 'Product View'}</span>
			</Button>
		</div>

		<div class="flex-1"></div>
	</div>

	<div class="flex h-full w-full gap-x-2 px-2">
		{#if activeDesignView === 'product'}
			<div class="min-h-full flex-1 border-r border-color-border p-2">
				<DesignProductView {designProducts} />
			</div>
		{/if}

		{#if activeDesignView === 'canvas'}
			<div class="sticky top-[2.8rem] h-[calc(100%-2.8rem)] flex-1 pb-2">
				<div class="h-full w-full rounded-md border border-color-border"></div>
			</div>
		{/if}

		<div class="sticky top-[2.8rem] z-1 h-[calc(100%-2.8rem)] w-[24rem] pt-2">
			<div class="space-y-4">
				<div
					class={cn(
						'h-60 w-full rounded-md',
						design.renderingImage &&
							'flex animate-pulse items-center justify-center border border-color-border bg-color-disabled-background'
					)}
				>
					<img
						class={cn('h-full w-full rounded-md object-cover', design.renderingImage && 'hidden')}
						src={design.renderedImageUrl ?? design.inspirationImageUrl}
						alt={design.name}
					/>

					{#if design.renderingImage}
						<p class="text-xs font-medium text-color-text-muted">
							{`Generating ${design.name} render..`}.
						</p>
					{/if}
				</div>

				<div class="space-y-4 px-2">
					<p class="text-sm">{design.description}</p>

					<div class="space-y-2">
						<Button>
							<ShoppingCartIcon class="size-4" />
							<span>Add all to Cart</span>
						</Button>
						<Button variant="outlined">
							<SparklesIcon class="size-4" />
							<span>Create new Design</span>
						</Button>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
