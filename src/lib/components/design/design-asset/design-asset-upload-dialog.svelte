<script lang="ts">
	import DesignAssetUpload from '$lib/components/design/design-asset/design-asset-upload.svelte';
	import { Dialog } from 'bits-ui';
	import type { ComponentProps, Snippet } from 'svelte';

	type DesignAssetUploadDialogProps = {
		class?: string;
		children: Snippet;
	} & ComponentProps<typeof DesignAssetUpload>;

	const {
		class: className = '',
		children,
		onUpload,
		...otherDesignAssetUploadDialogProps
	}: DesignAssetUploadDialogProps = $props();

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
			class="fixed top-[50%] left-[50%] z-50 w-full max-w-[40rem] translate-x-[-50%] translate-y-[-50%] outline-hidden data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
		>
			<DesignAssetUpload
				class="shadow shadow-color-shadow-muted"
				onUpload={(url) => {
					onUpload?.(url);
					open = false;
				}}
				{...otherDesignAssetUploadDialogProps}
			/>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
