<script lang="ts">
	import { goto } from '$app/navigation';
	import { CircleCheckBigIcon } from '@lucide/svelte';
	import { onMount } from 'svelte';

	onMount(() => {
		setTimeout(() => {
			goto('/ludwig');
		}, 3000);
	});
</script>

<section class="px-8 pt-8">
	<div class="mx-auto mt-40 w-fit space-y-2">
		<CircleCheckBigIcon class="size-16 text-color-success-text" />

		<h4 class="text-lg">Payment Successful</h4>
	</div>
</section>
