<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import Button from '$lib/components/button.svelte';
	import NoDesignIcon from '$lib/components/svgs/no-design-icon.svelte';

	const workspaceId = page.data.activeWorkspaceId;
</script>

<section class="px-8 pt-8">
	<!-- <div>
		<h1>Shop Designs</h1>
		<p>Browse furniture packages curated by top interior designers</p>
	</div> -->

	<div class="mx-auto mt-20 flex flex-col items-center gap-y-12">
		<div class="flex flex-col items-center">
			<NoDesignIcon class="size-32" />
			<p class="text-xl">No shoppable designs yet</p>
		</div>

		<Button class="w-fit" onclick={() => goto(`/${workspaceId}/ludwig`)}>Start a design</Button>
	</div>
</section>
