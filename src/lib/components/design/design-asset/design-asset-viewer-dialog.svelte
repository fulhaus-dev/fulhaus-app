<script lang="ts">
	import DesignAssetViewer from '$lib/components/design/design-asset/design-asset-viewer.svelte';
	import { XIcon } from '@lucide/svelte';
	import { Dialog } from 'bits-ui';
	import type { Snippet } from 'svelte';

	type FileUploadDialogProps = {
		class?: string;
		children: Snippet;
		title?: string;
	};

	const { class: className = '', children, title }: FileUploadDialogProps = $props();
</script>

<Dialog.Root>
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
			<DesignAssetViewer class="min-h-full w-[90vw]" />
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
