<script lang="ts">
	import DesignAssetViewer from '$lib/components/design/design-asset/design-asset-viewer.svelte';
	import { Dialog } from 'bits-ui';
	import type { Snippet } from 'svelte';

	type DesignAssetViewerDialogProps = {
		class?: string;
		children: Snippet;
		onSelect?: (fileUrl: string) => void;
	};

	const { class: className = '', children, onSelect }: DesignAssetViewerDialogProps = $props();

	let open = $state(false);
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={className}>
		{@render children()}
	</Dialog.Trigger>
	<Dialog.Portal>
		<Dialog.Overlay
			class="fixed inset-0 z-50 bg-color-overlay-background data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0"
		/>
		<Dialog.Content
			class="fixed top-[50%] left-[50%] z-50 mt-12 scrollbar-thin h-screen translate-x-[-50%] translate-y-[-50%] overflow-x-visible overflow-y-scroll px-4 outline-hidden data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
		>
			<DesignAssetViewer
				class="min-h-full w-[90vw]"
				onSelect={(url) => {
					onSelect?.(url);
					open = false;
				}}
			/>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
