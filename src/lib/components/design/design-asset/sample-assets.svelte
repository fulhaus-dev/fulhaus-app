<script lang="ts">
	import { page } from '$app/state';
	import ImageMasonry from '$lib/components/image-masonry.svelte';

	const sampleInspoImages = page.data.sampleInspoImages;
</script>

<ImageMasonry images={sampleInspoImages} />
