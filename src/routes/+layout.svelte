<script lang="ts">
	import { PUBLIC_CONVEX_URL } from '$env/static/public';
	import { setupConvex } from '$lib/client-hooks/convex.client.svelte';
	import Navbar from '$lib/components/layout/navbar.svelte';
	import '../app.css';

	setupConvex(PUBLIC_CONVEX_URL);

	let { children } = $props();
</script>

<main class="h-screen w-screen">
	<Navbar />
	{@render children?.()}
</main>
