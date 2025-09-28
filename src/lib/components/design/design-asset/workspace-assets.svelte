<script lang="ts">
	import { useDesignAssetQuery } from '$lib/client/queries/use-design-asset.query.svelte';
	import DesignAssetUpload from '$lib/components/design/design-asset/design-asset-upload.svelte';
	import ImageMasonry from '$lib/components/image-masonry.svelte';

	const { onSelect }: { onSelect?: (imageUrl: string) => void } = $props();

	const designAssetQuery = useDesignAssetQuery();
	const hasDesignAssets = $derived(designAssetQuery.designAssets.length > 0);
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
		images={designAssetQuery.designAssets.map((asset) => ({
			id: asset._id,
			url: asset.url,
			description: asset.metadata.description
		}))}
		{onSelect}
	/>
{/if}
