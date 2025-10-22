<script lang="ts">
	import { page } from '$app/state';
	import ImageMasonry from '$lib/components/image-masonry.svelte';
	import NoDesignIcon from '$lib/components/svgs/no-design-icon.svelte';

	const sampleInspoImages = page.data.sampleInspoImages;

	$inspect(sampleInspoImages);
</script>

<section class="h-full p-20 pt-0 pb-12">
	<div class="mx-auto flex h-full max-w-[1400px] gap-x-20">
		<div class="mt-40 max-w-fit space-y-4">
			<NoDesignIcon class="size-44" />

			<div class="max-w-96 space-y-1">
				<h2 class="text-2xl">We'll be right back!</h2>
				<div class="space-y-1">
					<p class="text-color-text-muted">
						We are currently making some updates to provide you with an even better experience.
					</p>
					<p class="text-color-text-muted">
						Please bear with us while we get everything back up and running again.
					</p>
				</div>
			</div>
		</div>

		<div class="h-full flex-1 overflow-y-hidden rounded-lg">
			<ImageMasonry images={sampleInspoImages} />
		</div>
	</div>
</section>
