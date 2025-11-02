<script lang="ts">
	import { XIcon } from '@lucide/svelte';
	import { Dialog } from 'bits-ui';
	import type { Snippet } from 'svelte';

	type DesignRenderViewerDialogProps = {
		class?: string;
		renderImage: { src: string; alt: string };
		children: Snippet;
	};

	const { class: className = '', renderImage, children }: DesignRenderViewerDialogProps = $props();
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
			class="fixed top-[50%] left-[50%] z-50 w-full max-w-[40rem] translate-x-[-50%] translate-y-[-50%] outline-hidden data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
		>
			<img src={renderImage.src} alt={renderImage.alt} />

			<Dialog.Close class="absolute top-1 right-1 cursor-pointer bg-color-background p-1 lg:hidden">
				<XIcon />
			</Dialog.Close>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
