<script lang="ts">
	import { useSharedDesignQuery } from '$lib/client/queries/use-design.query.svelte';
	import DesignSharePopover from '$lib/components/design/design-share-popover.svelte';
	import DesignTagButton from '$lib/components/design/design-tag-button.svelte';
	import DesignRenderViewerDialog from '$lib/components/design/design-view-sidebar/design-render-viewer-dialog.svelte';
	import FulhausLogoWordmark from '$lib/components/fulhaus-logo-wordmark.svelte';
	import Link from '$lib/components/link.svelte';
	import Tooltip from '$lib/components/tooltip.svelte';
	import number from '$lib/utils/number';
	import { Share2Icon } from '@lucide/svelte';
	import ProductDetailDialog from '$lib/components/product/product.detail-dialog.svelte';

	const sharedDesignQuery = useSharedDesignQuery();
	const totalDesignPrice = $derived(
		sharedDesignQuery.designProducts.reduce((a, b) => a + b.retailPrice, 0)
	);
</script>

<main class="h-screen w-screen">
	<nav
		class="flex h-[2.8rem] w-full items-center justify-between border-b border-color-border px-4"
	>
		<Link href="/">
			<FulhausLogoWordmark />
		</Link>

		<Tooltip content="Share design">
			<DesignSharePopover designId={sharedDesignQuery.design._id}>
				<div class="size-6 rounded-full bg-color-background p-1 text-xs">
					<Share2Icon class="size-full" />
				</div>
			</DesignSharePopover>
		</Tooltip>
	</nav>

	<section class="relative h-[calc(100%-2.8rem)] w-full gap-x-4 overflow-y-auto px-4 lg:flex">
		<div
			class="sticky top-0 w-full space-y-4 border-color-border pt-4 pr-4 lg:min-h-full lg:w-[36rem] lg:border-r lg:py-4"
		>
			<DesignRenderViewerDialog
				class="w-full cursor-pointer"
				renderImage={{
					src:
						sharedDesignQuery.design.renderedImageUrl ??
						sharedDesignQuery.design.inspirationImageUrl,
					alt: sharedDesignQuery.design.name
				}}
			>
				<img
					class="h-auto w-full object-cover lg:max-h-96 lg:rounded-md"
					src={sharedDesignQuery.design.renderedImageUrl ??
						sharedDesignQuery.design.inspirationImageUrl}
					alt={sharedDesignQuery.design.name}
				/>
			</DesignRenderViewerDialog>

			{#if totalDesignPrice > 0}
				<h5 class="text-3xl font-medium">
					{number.toMoney(totalDesignPrice, sharedDesignQuery.design.currencyCode)}
				</h5>
			{/if}

			<div class="flex-1">
				<h3>{sharedDesignQuery.design.name}</h3>
				<div class="flex flex-wrap items-center gap-2">
					{#each sharedDesignQuery.designTags as designTag (designTag._id)}
						<DesignTagButton tag={designTag.tag} />
					{/each}
				</div>
			</div>

			<p class="text-sm text-color-text-muted">{sharedDesignQuery.design.description}</p>
		</div>

		<div class="@container min-h-full w-full pt-4 pb-40 lg:pb-0">
			<div
				class="grid w-full grid-cols-1 gap-2 lg:@3xs:grid-cols-2 lg:@5xl:grid-cols-3 lg:@7xl:grid-cols-4 lg:@min-[120rem]:grid-cols-5"
			>
				{#each sharedDesignQuery.designProducts as designProduct (designProduct._id)}
					<div
						class="relative w-full rounded-md border border-color-border-muted bg-color-background p-4"
					>
						<div class="w-full space-y-4">
							<div class="group relative">
								<img
									class="h-64 w-full object-contain group-hover:opacity-50"
									src={designProduct.mainImageUrl}
									alt={designProduct.name}
								/>

								<div
									class="absolute top-1 right-1 z-1 flex-col items-center justify-center gap-y-12 lg:top-1/2 lg:right-auto lg:left-1/2 lg:hidden lg:-translate-x-1/2 lg:-translate-y-1/2 lg:group-hover:flex"
								>
									<ProductDetailDialog product={designProduct}>
										<p
											class=" cursor-pointer rounded-full bg-color-action-background px-2 py-1 text-xs font-medium text-nowrap text-color-action-text"
										>
											View Details
										</p>
									</ProductDetailDialog>
								</div>
							</div>

							<div class="flex-1 space-y-2 text-xs font-medium">
								<div>
									<h3>{designProduct.category}</h3>
									<p class="w-full truncate hover:text-wrap">
										{designProduct.name}
									</p>
									<p class="text-[10px] text-color-text-placeholder">
										{designProduct.brand?.toUpperCase()}
									</p>
								</div>

								<h5 class="text-3xl">
									{number.toMoney(designProduct.retailPrice, designProduct.currencyCode)}
								</h5>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>
</main>
