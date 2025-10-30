<script lang="ts">
	import { PUBLIC_CONVEX_URL } from '$env/static/public';
	import { setupConvex } from '$lib/client/convex/use-convex-client.svelte';
	import '../app.css';

	setupConvex(PUBLIC_CONVEX_URL);

	let { children } = $props();
</script>

{@render children?.()}
