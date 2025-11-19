<script lang="ts">
	import { page } from '$app/state';
	import { useRouteMutation } from '$lib/client/mutations/use-route.mutation.svelte';
	import { useDesignAssetQuery } from '$lib/client/queries/use-design-asset.query.svelte';
	import DesignAssetUploadDialog from '$lib/components/design/design-asset/design-asset-upload-dialog.svelte';
	import PinterestAssets from '$lib/components/design/design-asset/pinterest-assets.svelte';
	import SampleAssets from '$lib/components/design/design-asset/sample-assets.svelte';
	import WorkspaceAssets from '$lib/components/design/design-asset/workspace-assets.svelte';
	import TextInput from '$lib/components/text-input.svelte';
	import Tooltip from '$lib/components/tooltip.svelte';
	import { QueryParams } from '$lib/enums';
	import { cn } from '$lib/utils/cn';
	import { CloudUploadIcon, XIcon } from '@lucide/svelte';
	import { Tabs } from 'bits-ui';

	const tabs = [
		{
			id: 'sample',
			label: 'Samples',
			Component: SampleAssets
		},
		{
			id: 'personal',
			label: 'Your Assets',
			Component: WorkspaceAssets
		},
		{
			id: 'pinterest',
			label: 'Pinterest',
			Component: PinterestAssets
		}
	];

	type DesignAssetViewerProps = {
		class?: string;
		onSelect?: (fileUrl: string) => void;
	};

	const { class: className = '', onSelect }: DesignAssetViewerProps = $props();

	let searchMode = $state(false);
	let exitAutoTab = $state(false);

	const { updateRouteQuery } = useRouteMutation();

	const designAssetQuery = useDesignAssetQuery();
	const hasDesignAssets = $derived(designAssetQuery.designAssets.length > 0);

	function getTabValue() {
		return page.url.searchParams.get(QueryParams.ACTIVE_DESIGN_ASSET_TAB) ?? 'sample';
	}

	function setTabValue(newValue: string) {
		updateRouteQuery({
			queryString: `${QueryParams.ACTIVE_DESIGN_ASSET_TAB}=${newValue}`,
			options: { keepFocus: true }
		});
	}

	$effect(() => {
		if (!exitAutoTab && hasDesignAssets) {
			setTabValue('personal');
			exitAutoTab = true;
		}
	});
</script>

<Tabs.Root
	class={cn('w-full rounded-md bg-color-background lg:relative lg:py-2', className)}
	bind:value={getTabValue, setTabValue}
>
	<div class="fixed right-4 bottom-12 left-4 z-1 px-2 py-1 lg:sticky lg:top-2 lg:w-full">
		{#if !searchMode}
			<Tabs.List
				class="flex h-10 w-full items-center justify-between gap-x-8 rounded-md bg-color-background-surface/80 p-1 text-xs font-medium lg:h-12 lg:text-sm"
			>
				<div class="h-full">
					{#each tabs as tab (tab.id)}
						<Tabs.Trigger
							class="h-full rounded-md px-2 data-[state=active]:bg-color-action-background data-[state=active]:text-color-action-text lg:px-4"
							value={tab.id}
						>
							{tab.label}
						</Tabs.Trigger>
					{/each}
				</div>

				<div class="flex h-full items-center gap-x-4 pr-2">
					<!-- <Tooltip content="Search" sideOffset={2}>
						<button
							class="flex cursor-pointer items-center justify-center"
							type="button"
							onclick={() => (searchMode = true)}
						>
							<SearchIcon />
						</button>
					</Tooltip> -->

					<Tooltip content="Upload" sideOffset={2}>
						<DesignAssetUploadDialog
							type="inspo"
							class="flex h-full cursor-pointer items-center justify-center active:opacity-50"
							title="Upload inspiration image"
							accept=".jpeg, .jpg, .png"
							onUpload={onSelect}
							onOpen={() => setTabValue('personal')}
						>
							<CloudUploadIcon />
						</DesignAssetUploadDialog>
					</Tooltip>
				</div>
			</Tabs.List>
		{/if}

		{#if searchMode}
			<div class="relative">
				<TextInput class="h-10 pr-16" placeholder="Search assets" autofocus />

				<Tooltip
					class="absolute -top-8 right-0 z-1 h-full w-12 cursor-pointer"
					content="Close search"
				>
					<button
						class="h-full w-full cursor-pointer justify-items-center active:opacity-50"
						type="button"
						onclick={() => (searchMode = false)}
					>
						<XIcon />
					</button>
				</Tooltip>
			</div>
		{/if}
	</div>

	{#each tabs as tab (tab.id)}
		<Tabs.Content
			value={tab.id}
			class="max-h-screen overflow-y-auto pb-20 lg:max-h-max lg:overflow-y-visible lg:pb-0"
		>
			{#if tab.Component}
				<tab.Component {onSelect} />
			{/if}
		</Tabs.Content>
	{/each}
</Tabs.Root>
