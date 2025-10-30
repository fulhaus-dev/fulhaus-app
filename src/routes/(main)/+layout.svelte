<script lang="ts">
	import Navbar from '$lib/components/layout/navbar/navbar.svelte';
	import SidebarMobile from '$lib/components/layout/sidebar/sidebar-mobile.svelte';
	import Sidebar from '$lib/components/layout/sidebar/sidebar.svelte';

	let { children } = $props();
</script>

<main class="flex h-screen w-screen">
	<Sidebar />
	<SidebarMobile />

	<section class="h-full w-full flex-1">
		<Navbar class="sticky top-0 z-1 h-[2.8rem]" />

		<section class="h-[calc(100%-2.8rem)] w-full">
			{@render children?.()}
		</section>
	</section>
</main>
