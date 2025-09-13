<script lang="ts">
	import Button from '$lib/components/button.svelte';
	import PromptInspoImage from '$lib/assets/images/prompt-inspo.png';
	import PromptFloorPlanImage from '$lib/assets/images/prompt-floorplan.png';
	import DesignAssetViewer from '$lib/components/design/design-asset/design-asset-viewer.svelte';

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
	};

	const { onSelectPredefinedPrompt }: StartChatProps = $props();
</script>

<div class="flex flex-col items-center space-y-12 text-center">
	<h1
		class="bg-gradient-to-r from-color-success-text to-color-info-text bg-clip-text text-4xl text-transparent"
	>
		Let's design your space together!
	</h1>

	<DesignAssetViewer />

	<div class="w-fit space-y-4">
		<div class="mx-auto flex w-fit flex-wrap gap-2">
			{#each PREDEFINED_PROMPTS as prompt (prompt.id)}
				{@render PredefinedPromptButton(prompt.value)}
			{/each}
		</div>

		<div class="flex gap-x-4">
			{@render FilePromptButton({
				label: 'Start with inspiration',
				description: 'Use sample images, Pinterest boards, or your own photos',
				imageSrc: PromptInspoImage,
				imageAlt: 'A modern living room space'
			})}

			{@render FilePromptButton({
				label: 'Start with a floor plan',
				description: 'Upload your floor plan',
				imageSrc: PromptFloorPlanImage,
				imageAlt: 'Floor plan'
			})}
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

{#snippet FilePromptButton({
	label,
	description,
	imageSrc,
	imageAlt
}: {
	label: string;
	description: string;
	imageSrc: string;
	imageAlt: string;
})}
	<Button
		class="items start h-auto w-full justify-between gap-x-20 rounded-lg p-1 pl-2 text-sm"
		variant="filled"
	>
		<p class="text-start text-sm text-wrap">
			<span class="block font-semibold">{label}</span>
			<span class="block text-xs text-color-action-text-muted">{description}</span>
		</p>

		<img class="h-20 w-20 rounded-md object-cover" src={imageSrc} alt={imageAlt} />
	</Button>
{/snippet}
