<script lang="ts">
	import { page } from '$app/state';
	import ImageMasonry from '$lib/components/image-masonry.svelte';

	const sampleInspoImages = page.data.sampleInspoImages;
</script>

<div class="fixed inset-0 -z-1 overflow-y-hidden">
	<ImageMasonry images={sampleInspoImages} />
	<div
		class="absolute inset-0 z-1 bg-gradient-to-b from-color-background/92 via-color-background/72 to-color-background/52"
	></div>
</div>
