<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import FulhausLoader from '$lib/components/loaders/fulhaus-loader.svelte';
	import { QueryParams } from '$lib/enums';
	import { onMount } from 'svelte';

	const redirectUrl = page.url.searchParams.get(QueryParams.PINTEREST_CALLBACK_REDIRECT_URL) ?? '/';

	onMount(() => {
		setTimeout(() => {
			goto(redirectUrl);
		}, 1000);
	});
</script>

<section class="px-8 pt-8">
	<div class="mx-auto mt-40 w-fit space-y-2">
		<FulhausLoader />
	</div>
</section>
