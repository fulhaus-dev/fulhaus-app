<script lang="ts">
	import { useDesignPage } from '$lib/client-hooks/use-design-page.svelte';
	import Button from '$lib/components/button.svelte';
	import DesignProductView from '$lib/components/design/design-product-view.svelte';
	import DesignViewSidebar from '$lib/components/design/design-view-sidebar/design-view-sidebar.svelte';
	import { cn } from '$lib/utils/cn';
	import { ArmchairIcon, PaletteIcon } from '@lucide/svelte';

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

	<div
		class={cn(
			'flex min-h-[calc(100%-2.8rem)]  w-full gap-x-2 px-2',
			activeDesignView === 'canvas' && 'h-full'
		)}
	>
		{#if activeDesignView === 'product'}
			<div class="flex-1 border-r border-color-border p-2">
				<DesignProductView
					designId={design._id}
					{designProducts}
					generatingDesignFurnitureRecommendation={design.generatingFurnitureRecommendation ||
						false}
				/>
			</div>
		{/if}

		{#if activeDesignView === 'canvas'}
			<div class="sticky top-[2.8rem] h-[calc(100%-2.8rem)] flex-1 pb-2">
				<div class="h-full w-full rounded-md border border-color-border"></div>
			</div>
		{/if}

		<div class="sticky top-[2.8rem] z-1 h-[calc(100%-2.8rem)] w-[24rem] pt-2">
			<DesignViewSidebar {design} />
		</div>
	</div>
</section>
