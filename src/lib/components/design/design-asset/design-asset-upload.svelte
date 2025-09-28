<script lang="ts">
	import FileUpload from '$lib/components/file-upload.svelte';
	import type { ComponentProps } from 'svelte';
	import type { DesignAssetFileType } from '$lib/types';
	import UploadingDesignAssetLoader from '$lib/components/design/design-asset/uploading-design-asset-loader.svelte';
	import { useDesignAssetMutation } from '$lib/client/mutations/use-design-asset.mutation.svelte';

	type DesignAssetUploadProps = {
		type: DesignAssetFileType;
		onUpload?: (imageUrl: string) => void;
	} & ComponentProps<typeof FileUpload>;

	const { type, onUpload, ...otherDesignAssetUploadProps }: DesignAssetUploadProps = $props();

	const { designAssetMutationState, uploadDesignAssetFile, uploadDesignAssetUrl } =
		useDesignAssetMutation({ onUpload });
</script>

<div class="relative">
	{#if designAssetMutationState.uploading}
		<UploadingDesignAssetLoader />
	{/if}

	<FileUpload
		{...otherDesignAssetUploadProps}
		onUploadFile={(files) => uploadDesignAssetFile(files[0], type)}
		onUploadUrl={(url) => uploadDesignAssetUrl(url, type)}
	/>
</div>
