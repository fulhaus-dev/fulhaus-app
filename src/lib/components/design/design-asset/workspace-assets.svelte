<script lang="ts">
	import { useDesignAsset } from '$lib/client-hooks/use-design-asset.svelte';
	import DesignAssetUpload from '$lib/components/design/design-asset/design-asset-upload.svelte';
	import ImageMasonry from '$lib/components/image-masonry.svelte';

	const { onSelect }: { onSelect?: (imageUrl: string) => void } = $props();

	const { designAsset } = useDesignAsset();
	const hasDesignAssets = $derived(designAsset.assets.length > 0);
</script>

{#if !hasDesignAssets}
	<div class="h-full w-full justify-items-center py-20">
		<DesignAssetUpload
			class="border border-color-border-muted"
			type="inspo"
			title="Upload an inspiration image"
			accept=".jpg, .jpeg, .png"
			onUpload={onSelect}
		/>
	</div>
{/if}

{#if hasDesignAssets}
	<ImageMasonry
		images={designAsset.assets.map((asset) => ({
			id: asset._id,
			url: asset.url,
			description: asset.metadata.description
		}))}
		{onSelect}
	/>
{/if}
