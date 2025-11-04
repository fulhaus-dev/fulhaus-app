<script lang="ts">
	import type { Product, ProductCategory } from '$lib/types';
	import { ChevronDown, XIcon } from '@lucide/svelte';
	import { Dialog, Popover } from 'bits-ui';
	import type { Snippet } from 'svelte';
	import ProductGrid from '$lib/components/product/product.grid.svelte';
	import { useProductCategoriesQuery } from '$lib/client/queries/use-product.query.svelte';
	import { cn } from '$lib/utils/cn';
	import Button from '$lib/components/button.svelte';
	import TextInput from '$lib/components/text-input.svelte';
	import { page } from '$app/state';
	import { QueryParams } from '$lib/enums';
	import { useRouteMutation } from '$lib/client/mutations/use-route.mutation.svelte';

	type ProductGridDialogProps = {
		children: Snippet;
		class?: string;
		onSelectProduct: (product: Product) => void;
	};

	const { children, class: className = '', onSelectProduct }: ProductGridDialogProps = $props();

	const productFullTextSearchValue = $derived(
		page.url.searchParams.get(QueryParams.PRODUCT_FULL_TEXT_SEARCH_VALUE) ?? undefined
	);

	let isOpen = $state(false);

	let selectedProductCategory = $state<ProductCategory>('Sofa');
	let selectProductCategoryPopoverIsOpen = $state(false);
	let categorySearchValue = $state<string>();

	const { updateRouteQuery } = useRouteMutation();

	const productCategoriesQuery = useProductCategoriesQuery();
	const productCategories = $derived.by(() => {
		let filteredCategories = productCategoriesQuery.categories.toSorted((a, b) =>
			a.localeCompare(b)
		);

		if (categorySearchValue)
			filteredCategories = filteredCategories.filter((category) =>
				category.toLowerCase().includes(categorySearchValue!.toLowerCase())
			);

		return filteredCategories;
	});

	function handleDialogOpenChange(open: boolean) {
		if (open) return;

		categorySearchValue = undefined;
		updateRouteQuery({
			queryKeysToRemove: [
				QueryParams.PRODUCT_FULL_TEXT_SEARCH_VALUE,
				QueryParams.PRODUCT_FILTERS,
				QueryParams.PRODUCT_SORT_OPTIONS
			],
			options: { keepFocus: true }
		});
	}
</script>

<Dialog.Root bind:open={isOpen} onOpenChange={handleDialogOpenChange}>
	<Dialog.Trigger class={className}>
		{@render children()}
	</Dialog.Trigger>
	<Dialog.Portal>
		<Dialog.Overlay
			class="fixed inset-0 z-50 bg-color-overlay-background/20 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0"
		/>
		<Dialog.Content
			class="fixed top-0 right-0 z-50 flex h-screen w-screen flex-col bg-color-background outline-hidden data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 lg:w-[56rem]"
		>
			<Dialog.Close class="absolute top-4 right-4 cursor-pointer">
				<XIcon />
			</Dialog.Close>

			<div
				class="flex flex-col gap-y-4 bg-color-background-surface px-4 py-4 lg:flex-row lg:gap-x-12 lg:px-8"
			>
				<h5 class="text-lg font-medium">Products</h5>

				{#if !productFullTextSearchValue}
					{@render SelectProductCategoryPopover()}
				{/if}
			</div>

			{#if isOpen}
				<ProductGrid
					{selectedProductCategory}
					onSelectProduct={(product) => {
						((isOpen = false), onSelectProduct(product));
					}}
				/>
			{/if}
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>

{#snippet SelectProductCategoryPopover()}
	<Popover.Root bind:open={selectProductCategoryPopoverIsOpen}>
		<Popover.Trigger
			class="flex h-12 w-full items-center justify-between rounded-md border border-color-border bg-color-action-background px-2 text-lg font-medium text-color-action-text lg:w-80"
		>
			{selectedProductCategory}
			<ChevronDown
				class={cn(
					'size-4 transition-all duration-300',
					selectProductCategoryPopoverIsOpen && 'rotate-180'
				)}
			/>
		</Popover.Trigger>
		<Popover.Portal>
			<Popover.Content
				class="z-50 w-[90vw] origin-(--bits-popover-content-transform-origin) rounded-md border border-color-border bg-color-background shadow shadow-color-shadow data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 lg:w-80"
				sideOffset={4}
				align="start"
				collisionPadding={{ top: 8, right: 8, bottom: 8, left: 8 }}
			>
				<div>
					<div class="p-2">
						<TextInput
							class="bg-color-background-surface"
							bind:value={categorySearchValue}
							type="search"
							placeholder="Search..."
						/>
					</div>

					<div class="scrollbar-thin flex max-h-96 flex-col overflow-y-auto">
						{#each productCategories as productCategory, index (`${index}-${productCategory}`)}
							<Button
								class="w-full justify-start px-4 py-3 hover:bg-color-background-surface"
								variant="text"
								onclick={() => {
									selectedProductCategory = productCategory;
									selectProductCategoryPopoverIsOpen = false;
								}}
							>
								{productCategory}
							</Button>
						{/each}
					</div>
				</div>
			</Popover.Content>
		</Popover.Portal>
	</Popover.Root>
{/snippet}
