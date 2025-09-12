<script lang="ts">
	import { PUBLIC_CONVEX_URL } from '$env/static/public';
	import { setupConvex } from '$lib/client-hooks/convex.client.svelte';
	import Navbar from '$lib/components/layout/navbar.svelte';
	import '../app.css';

	setupConvex(PUBLIC_CONVEX_URL);

	let { children } = $props();
</script>

<main class="relative h-screen w-screen">
	<Navbar class="sticky top-0 h-[2.8rem]" />

	<main class="h-[calc(100%-2.8rem)] w-full">
		{@render children?.()}
	</main>
</main>
