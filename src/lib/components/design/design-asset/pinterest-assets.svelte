<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/button.svelte';
	import { onMount } from 'svelte';

	const { onSelect }: { onSelect?: (imageUrl: string) => void } = $props();

	let currentRoute = $state('/');

	onMount(() => {
		currentRoute = window.location.pathname;
	});
</script>

<div class="h-full w-full space-y-8 py-20">
	<div class="mx-auto w-fit">
		<h3>Get recommendations right from your Pinterest Boards</h3>
		<p class="text-color-text-muted">
			Connect your account to design from your existing Pinterest inspiration.
		</p>
	</div>

	<Button
		class="relative mx-auto block h-[32vh] w-full max-w-[32rem] border border-color-border-muted"
		variant="text"
		onclick={() => goto(`/api/pinterest/auth?redirect=${encodeURIComponent(currentRoute)}`)}
	>
		<img
			class="h-full w-full rounded-md object-cover"
			src="https://pub-e4742e96ef9945dfa0f14c36708e269a.r2.dev/pinterest-modal-image.webp"
			alt="Pinterest Banner"
		/>

		<p
			class="absolute right-4 bottom-2 left-4 z-1 rounded-md bg-neutral-800 p-2 text-lg font-medium text-white ring-1 ring-color-border-muted"
		>
			Connect Pinterest
		</p>
	</Button>
</div>
