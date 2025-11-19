<script lang="ts">
	import { page } from '$app/state';
	import { useRouteMutation } from '$lib/client/mutations/use-route.mutation.svelte';
	import DesignAssetViewer from '$lib/components/design/design-asset/design-asset-viewer.svelte';
	import { QueryParams } from '$lib/enums';
	import { XIcon } from '@lucide/svelte';
	import { Dialog } from 'bits-ui';
	import { onMount, type Snippet } from 'svelte';

	type DesignAssetViewerDialogProps = {
		class?: string;
		children: Snippet;
		onSelect?: (fileUrl: string) => void;
	};

	const { class: className = '', children, onSelect }: DesignAssetViewerDialogProps = $props();

	let open = $state(false);

	const activeDesignAssetTab = page.url.searchParams.get(QueryParams.ACTIVE_DESIGN_ASSET_TAB);

	const { updateRouteQuery } = useRouteMutation();

	onMount(() => {
		if (activeDesignAssetTab) open = true;
	});
</script>

<Dialog.Root
	bind:open
	onOpenChange={(isOpen) => {
		if (!isOpen)
			updateRouteQuery({
				queryKeysToRemove: [QueryParams.ACTIVE_DESIGN_ASSET_TAB],
				options: { keepFocus: true }
			});
	}}
>
	<Dialog.Trigger class={className}>
		{@render children()}
	</Dialog.Trigger>
	<Dialog.Portal>
		<Dialog.Overlay
			class="fixed inset-0 z-50 bg-color-overlay-background data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0"
		/>
		<Dialog.Content
			class="fixed top-[50%] left-[50%] z-50 mt-12 scrollbar-thin h-screen translate-x-[-50%] translate-y-[-50%] overflow-x-visible overflow-y-auto px-4 outline-hidden data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
		>
			<div class="sticky top-1 right-1 z-10 flex justify-end lg:hidden">
				<Dialog.Close class="rounded-full bg-white p-1">
					<XIcon class="h-4 w-4" />
				</Dialog.Close>
			</div>

			<DesignAssetViewer
				class="min-h-full w-screen lg:w-[90vw]"
				onSelect={(url) => {
					onSelect?.(url);
					open = false;
				}}
			/>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
