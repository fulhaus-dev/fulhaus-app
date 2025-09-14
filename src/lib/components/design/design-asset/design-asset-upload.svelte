<script lang="ts">
	import FileUpload from '$lib/components/file-upload.svelte';
	import type { ComponentProps } from 'svelte';
	import type { DesignAssetFileType } from '$lib/types';
	import { useDesignAssetUpload } from '$lib/client-hooks/use-design-asset-upload.svelte';
	import UploadingDesignAssetLoader from '$lib/components/design/design-asset/uploading-design-asset-loader.svelte';

	type DesignAssetUploadProps = {
		type: DesignAssetFileType;
		onUpload?: (imageUrl: string) => void;
	} & ComponentProps<typeof FileUpload>;

	const { type, onUpload, ...otherDesignAssetUploadProps }: DesignAssetUploadProps = $props();

	const { designAssetUpload, uploadFile, uploadUrl } = useDesignAssetUpload({ onUpload });
</script>

<div class="relative contents">
	{#if designAssetUpload.uploading}
		<UploadingDesignAssetLoader />
	{/if}

	<FileUpload
		{...otherDesignAssetUploadProps}
		onUploadFile={(files) => uploadFile(files[0], type)}
		onUploadUrl={(url) => uploadUrl(url, type)}
	/>
</div>
