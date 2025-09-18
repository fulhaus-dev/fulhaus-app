<script lang="ts">
	import { useDesignProduct } from '$lib/client-hooks/use-design-product.svelte';
	import Button from '$lib/components/button.svelte';
	import DesignAssetViewerDialog from '$lib/components/design/design-asset/design-asset-viewer-dialog.svelte';
	import TextArea from '$lib/components/text-area.svelte';
	import TextInput from '$lib/components/text-input.svelte';
	import { productCategoryIcons } from '$lib/constants';
	import type { SpaceType, UpdateDesign } from '$lib/types';
	import { cn } from '$lib/utils/cn';
	import { ChevronsUpDownIcon, XIcon } from '@lucide/svelte';
	import { Popover } from 'bits-ui';

	const { spaceType, updates = $bindable() }: { spaceType: SpaceType; updates: UpdateDesign } =
		$props();

	let productCategorySearchValue = $state('');

	const { designProduct } = useDesignProduct(spaceType);

	const filteredProductCategories = $derived.by(() => {
		const availableProductCategories = designProduct.spaceProductCategories.filter(
			(productCategory) => !updates.productCategories?.includes(productCategory)
		);

		if (productCategorySearchValue === '') return availableProductCategories;

		return availableProductCategories.filter((productCategory) =>
			productCategory.toLowerCase().includes(productCategorySearchValue.toLowerCase())
		);
	});
</script>

<div class="space-y-8">
	<TextInput class="bg-transparent" label="Name" bind:value={updates.name} autofocus />
	<TextArea class="bg-transparent" label="Description" bind:value={updates.description} />

	<div class="space-y-1.5">
		<h5 class="font-medium">Product Categories</h5>
		<div class="space-y-2 rounded-md border border-color-border p-2">
			<div class="grid w-full grid-cols-2 gap-2">
				{#each updates?.productCategories ?? [] as productCategory, i (`${productCategory}-${i}`)}
					<Button
						variant="outlined"
						class="group flex h-8 w-full justify-between gap-x-2 text-xs ring-0 transition-all duration-300 ease-in-out hover:text-color-error-text hover:line-through"
						onclick={() => {
							updates.productCategories = updates.productCategories?.filter(
								(currentProductCategory) => currentProductCategory !== productCategory
							);
						}}
					>
						<div class="flex items-center gap-x-2">
							<span
								class={cn(
									'text-lg text-color-text-placeholder group-hover:text-color-error-text',
									productCategoryIcons[productCategory]
								)}
							></span>
							<p>
								{productCategory}
							</p>
						</div>

						<XIcon class="size-4 opacity-0 group-hover:opacity-100" />
					</Button>
				{/each}
			</div>

			{@render SelectProductCategoryCombobox()}
		</div>
	</div>

	<div class="space-y-1.5">
		<h5 class="font-medium">Inspiration Image</h5>
		<DesignAssetViewerDialog
			class="relative"
			onSelect={(imageUrl) => (updates.inspirationImageUrl = imageUrl)}
		>
			<img
				class="h-auto w-full rounded-md object-cover"
				src={updates.inspirationImageUrl}
				alt="Inspiration"
			/>

			<div class="absolute inset-0 z-1 flex items-end justify-center p-2 font-medium">
				<p class="w-full rounded-md bg-color-background/80 p-2">Change Inspiration Image</p>
			</div>
		</DesignAssetViewerDialog>
	</div>
</div>

{#snippet SelectProductCategoryCombobox()}
	<Popover.Root
		onOpenChange={(isOpen) => {
			if (!isOpen) productCategorySearchValue = '';
		}}
	>
		<Popover.Trigger class="relative w-full">
			<div
				class="flex h-10 w-full items-center justify-between gap-x-2 rounded-md border border-color-border bg-color-background-surface px-2"
			>
				<span>Add product categories</span>
				<ChevronsUpDownIcon />
			</div>
		</Popover.Trigger>

		<Popover.Content
			class="z-30 w-80 origin-(--bits-popover-content-transform-origin) rounded-md border border-color-border bg-color-background shadow data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
			sideOffset={2}
			avoidCollisions={false}
		>
			<div class="p-2">
				<TextInput
					placeholder="Search..."
					aria-label="Search product categories"
					bind:value={productCategorySearchValue}
					autofocus
				/>
			</div>

			<div class="scrollbar-thin h-96 w-full overflow-y-auto">
				{#each filteredProductCategories as productCategory, i (`${productCategory}-${i}`)}
					<button
						class="flex h-10 w-full cursor-pointer items-center gap-x-4 px-4 hover:bg-color-background-surface"
						type="button"
						onclick={() => {
							updates.productCategories = [...(updates.productCategories ?? []), productCategory];
						}}
					>
						<span
							class={cn(
								'text-lg text-color-text-placeholder',
								productCategoryIcons[productCategory]
							)}
						></span>

						<span>{productCategory}</span>
					</button>
				{/each}
			</div>
		</Popover.Content>
	</Popover.Root>
{/snippet}
