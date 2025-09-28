<script lang="ts">
	import { page } from '$app/state';
	import { useDesignAssetMutation } from '$lib/client/mutations/use-design-asset.mutation.svelte';
	import UploadingDesignAssetLoader from '$lib/components/design/design-asset/uploading-design-asset-loader.svelte';
	import ImageMasonry from '$lib/components/image-masonry.svelte';

	const sampleInspoImages = page.data.sampleInspoImages;

	const { onSelect }: { onSelect?: (imageUrl: string) => void } = $props();

	const { designAssetMutationState, uploadDesignAssetUrl } = useDesignAssetMutation({
		onUpload: onSelect
	});
</script>

{#if designAssetMutationState.uploading}
	<UploadingDesignAssetLoader />
{/if}

<ImageMasonry
	images={sampleInspoImages}
	onSelect={(imageUrl) => uploadDesignAssetUrl(imageUrl, 'inspo')}
/>
