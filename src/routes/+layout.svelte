<script lang="ts">
	import { PUBLIC_CONVEX_URL } from '$env/static/public';
	import { setupConvex } from '$lib/client/convex/use-convex-client.svelte';
	import '../app.css';

	import posthog from 'posthog-js';
	import { browser } from '$app/environment';
	import { beforeNavigate, afterNavigate } from '$app/navigation';

	setupConvex(PUBLIC_CONVEX_URL);

	if (browser) {
		beforeNavigate(() => posthog.capture('$pageleave'));
		afterNavigate(() => posthog.capture('$pageview'));
	}

	let { children } = $props();
</script>

{@render children?.()}
