<script lang="ts">
	import { useWorkspacePlanQuery } from '$lib/client/queries/use-workspace.query.svelte';
	import Button from '$lib/components/button.svelte';
	import LudwigChatFileInputDialog from '$lib/components/ludwig/ludwig-chat-file-input-dialog.svelte';

	export const PREDEFINED_PROMPTS = [
		{ id: 'living-room', value: 'Living Room' },
		{ id: 'bedroom', value: 'Bedroom' },
		{ id: 'dining', value: 'Dining Room' },
		{ id: 'office', value: 'Office' },
		{ id: '2bed', value: '2-bedroom apartment' },
		{ id: 'outdoor', value: 'Outdoor' }
	];

	type StartChatProps = {
		onSelectPredefinedPrompt: (prompt: string) => void;
		onSelectInspirationImage: (imageUrl: string) => void;
		onselectFloorPlanImage: (imageUrl: string) => void;
	};

	const {
		onSelectPredefinedPrompt,
		onSelectInspirationImage,
		onselectFloorPlanImage
	}: StartChatProps = $props();

	const workspacePlanQuery = useWorkspacePlanQuery();
	const hasSufficientRoomTokens = $derived(workspacePlanQuery.hasSufficientRoomTokens);
</script>

<div class="flex flex-col items-center space-y-8 text-center lg:space-y-12">
	<h1
		class="bg-gradient-to-r from-color-success-text to-color-info-text bg-clip-text text-2xl text-transparent lg:text-4xl"
	>
		Let's design your space together!
	</h1>

	<div class="w-fit space-y-4">
		{#if hasSufficientRoomTokens}
			<div class="mx-auto flex w-fit flex-wrap justify-center gap-2">
				{#each PREDEFINED_PROMPTS as prompt (prompt.id)}
					{@render PredefinedPromptButton(prompt.value)}
				{/each}
			</div>

			<div class="flex gap-x-4">
				<LudwigChatFileInputDialog
					type="inspo"
					label="Start with an inspiration"
					description="Use sample images, Pinterest boards, or your own photos"
					onSelect={onSelectInspirationImage}
				/>

				<LudwigChatFileInputDialog
					type="floorplan"
					label="Start with a floor plan"
					description="Upload your floor plan"
					onSelect={onselectFloorPlanImage}
				/>
			</div>
		{/if}
	</div>
</div>

{#snippet PredefinedPromptButton(prompt: string)}
	<Button
		class="h-8 w-fit rounded-sm px-4 text-sm font-medium shadow-xs lg:h-10"
		onclick={() => onSelectPredefinedPrompt(prompt)}
	>
		{prompt}
	</Button>
{/snippet}
