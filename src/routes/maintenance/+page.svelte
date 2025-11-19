<script lang="ts">
	import { page } from '$app/state';
	import FulhausLogoWordmark from '$lib/components/fulhaus-logo-wordmark.svelte';
	import ImageMasonry from '$lib/components/image-masonry.svelte';

	const sampleInspoImages = page.data.sampleInspoImages;
</script>

<main class="h-screen p-4">
	<section
		class="mx-auto flex h-full max-w-[1400px] flex-col gap-y-8 lg:flex-row lg:gap-x-20 lg:gap-y-0"
	>
		<div class="mt-8 max-w-fit space-y-4 lg:mt-40">
			<FulhausLogoWordmark class="w-auto lg:h-8" />

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
	</section>
</main>
