<script lang="ts">
	let { children } = $props();
</script>

<main class="flex h-screen w-screen">
	<section class="h-full w-full flex-1">
		<!-- <Navbar class="sticky top-0 z-50 h-[2.8rem]" /> -->

		<section class="h-[calc(100%-2.8rem)] w-full">
			{@render children?.()}
		</section>
	</section>
</main>
