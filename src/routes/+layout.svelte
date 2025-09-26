<script lang="ts">
	import { PUBLIC_CONVEX_URL } from '$env/static/public';
	import { setupConvex } from '$lib/client-hooks/convex.client.svelte';
	import Navbar from '$lib/components/layout/navbar/navbar.svelte';
	import Sidebar from '$lib/components/layout/sidebar/sidebar.svelte';
	import '../app.css';

	setupConvex(PUBLIC_CONVEX_URL);

	let { children } = $props();
</script>

<main class="flex h-screen w-screen">
	<Sidebar />

	<section class="h-full w-full flex-1">
		<Navbar class="sticky top-0 z-1 h-[2.8rem]" />

		<section class="h-[calc(100%-2.8rem)] w-full">
			{@render children?.()}
		</section>
	</section>
</main>
