<script lang="ts">
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
</script>

<div class="flex flex-col items-center space-y-12 text-center">
	<h1
		class="bg-gradient-to-r from-color-success-text to-color-info-text bg-clip-text text-4xl text-transparent"
	>
		Let's design your space together!
	</h1>

	<div class="w-fit space-y-4">
		<div class="mx-auto flex w-fit flex-wrap gap-2">
			{#each PREDEFINED_PROMPTS as prompt (prompt.id)}
				{@render PredefinedPromptButton(prompt.value)}
			{/each}
		</div>

		<div class="flex gap-x-4">
			<LudwigChatFileInputDialog
				type="inspo"
				label="Start with inspiration"
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
	</div>
</div>

{#snippet PredefinedPromptButton(prompt: string)}
	<Button
		class=" h-10 w-fit rounded-sm px-4 text-sm font-medium shadow-xs"
		onclick={() => onSelectPredefinedPrompt(prompt)}
	>
		{prompt}
	</Button>
{/snippet}
