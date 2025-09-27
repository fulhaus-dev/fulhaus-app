<script lang="ts">
	import { page } from '$app/state';
	import { useDesignAssetUpload } from '$lib/client-hooks/use-design-asset-upload.svelte';
	import UploadingDesignAssetLoader from '$lib/components/design/design-asset/uploading-design-asset-loader.svelte';
	import ImageMasonry from '$lib/components/image-masonry.svelte';

	const sampleInspoImages = page.data.sampleInspoImages;

	const { onSelect }: { onSelect?: (imageUrl: string) => void } = $props();

	const { designAssetUpload, uploadUrl } = useDesignAssetUpload({ onUpload: onSelect });
</script>

{#if designAssetUpload.uploading}
	<UploadingDesignAssetLoader class="fixed z-50 h-screen w-screen" />
{/if}

<ImageMasonry images={sampleInspoImages} onSelect={(imageUrl) => uploadUrl(imageUrl, 'inspo')} />
