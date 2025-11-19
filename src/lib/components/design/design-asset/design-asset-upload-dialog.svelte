<script lang="ts">
	import DesignAssetUpload from '$lib/components/design/design-asset/design-asset-upload.svelte';
	import { XIcon } from '@lucide/svelte';
	import { Dialog } from 'bits-ui';
	import type { ComponentProps, Snippet } from 'svelte';

	type DesignAssetUploadDialogProps = {
		class?: string;
		children: Snippet;
		onOpen?: (open: boolean) => void;
	} & ComponentProps<typeof DesignAssetUpload>;

	const {
		class: className = '',
		children,
		onUpload,
		onOpen = () => {},
		...otherDesignAssetUploadDialogProps
	}: DesignAssetUploadDialogProps = $props();

	let open = $state(false);
</script>

<Dialog.Root bind:open onOpenChange={onOpen}>
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
			<div class="sticky top-1 right-1 z-10 flex justify-end lg:hidden">
				<Dialog.Close class="rounded-full bg-white p-1">
					<XIcon class="h-4 w-4" />
				</Dialog.Close>
			</div>

			<div class="px-2 lg:px-0">
				<DesignAssetUpload
					class="shadow shadow-color-shadow-muted"
					onUpload={(url) => {
						onUpload?.(url);
						open = false;
					}}
					{...otherDesignAssetUploadDialogProps}
				/>
			</div>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
