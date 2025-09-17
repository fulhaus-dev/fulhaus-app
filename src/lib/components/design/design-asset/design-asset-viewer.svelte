<script lang="ts">
	import { page } from '$app/state';
	import { useRouteQuery } from '$lib/client-hooks/use-route-query.svelte';
	import DesignAssetUploadDialog from '$lib/components/design/design-asset/design-asset-upload-dialog.svelte';
	import PinterestAssets from '$lib/components/design/design-asset/pinterest-assets.svelte';
	import SampleAssets from '$lib/components/design/design-asset/sample-assets.svelte';
	import WorkspaceAssets from '$lib/components/design/design-asset/workspace-assets.svelte';
	import TextInput from '$lib/components/text-input.svelte';
	import Tooltip from '$lib/components/tooltip.svelte';
	import { QueryParams } from '$lib/enums';
	import { cn } from '$lib/utils/cn';
	import { CloudUploadIcon, SearchIcon, XIcon } from '@lucide/svelte';
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

	const routeQuery = useRouteQuery();

	function getTabValue() {
		return page.url.searchParams.get(QueryParams.ACTIVE_DESIGN_ASSET_TAB) ?? 'sample';
	}

	function setTabValue(newValue: string) {
		routeQuery.append(`${QueryParams.ACTIVE_DESIGN_ASSET_TAB}=${newValue}`);
	}
</script>

<Tabs.Root
	class={cn('relative w-full rounded-md bg-color-background py-2', className)}
	bind:value={getTabValue, setTabValue}
>
	<div class="sticky top-2 z-1 w-full px-2 py-1">
		{#if !searchMode}
			<Tabs.List
				class="flex h-12 w-full items-center justify-between gap-x-8 rounded-md bg-color-background-surface/80 p-1 text-sm font-medium"
			>
				<div class="h-full">
					{#each tabs as tab (tab.id)}
						<Tabs.Trigger
							class="h-full rounded-md px-4 data-[state=active]:bg-color-action-background data-[state=active]:text-color-action-text"
							value={tab.id}
						>
							{tab.label}
						</Tabs.Trigger>
					{/each}
				</div>

				<div class="flex h-full items-center gap-x-4 pr-2">
					<Tooltip content="Search" sideOffset={2}>
						<button
							class="flex cursor-pointer items-center justify-center"
							type="button"
							onclick={() => (searchMode = true)}
						>
							<SearchIcon />
						</button>
					</Tooltip>

					<Tooltip content="Upload" sideOffset={2}>
						<DesignAssetUploadDialog
							type="inspo"
							class="flex h-full cursor-pointer items-center justify-center active:opacity-50"
							title="Upload inspiration image"
							accept=".jpeg, .jpg, .png"
						>
							<CloudUploadIcon />
						</DesignAssetUploadDialog>
					</Tooltip>
				</div>
			</Tabs.List>
		{/if}

		{#if searchMode}
			<div class="relative">
				<TextInput class="pr-16" placeholder="Search assets" autofocus />

				<Tooltip class="absolute right-0 z-1 h-full w-12 cursor-pointer" content="Close search">
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
		<Tabs.Content value={tab.id}>
			{#if tab.Component}
				<tab.Component {onSelect} />
			{/if}
		</Tabs.Content>
	{/each}
</Tabs.Root>
