<script lang="ts">
	import FileUpload from '$lib/components/file-upload.svelte';
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
			class="fixed top-[50%] left-[50%] z-50 w-full max-w-[40rem] translate-x-[-50%] translate-y-[-50%] outline-hidden data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
		>
			<FileUpload class="shadow shadow-color-shadow-muted" {title} />
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
