<script lang="ts">
	import DesignAssetUploadDialog from '$lib/components/design/design-asset/design-asset-upload-dialog.svelte';
	import DesignAssetViewerDialog from '$lib/components/design/design-asset/design-asset-viewer-dialog.svelte';
	import PromptInspoImage from '$lib/assets/images/prompt-inspo.png';
	import PromptFloorPlanImage from '$lib/assets/images/prompt-floorplan.png';
	import { cn } from '$lib/utils/cn';

	type LudwigChatFileInputDialogProps = {
		class?: string;
		type: 'inspo' | 'floorplan';
		label: string;
		description?: string;
		onSelect: (fileUrl: string) => void;
	};

	const {
		class: className = '',
		type,
		label,
		description,
		onSelect
	}: LudwigChatFileInputDialogProps = $props();
</script>

{#if type === 'inspo'}
	<DesignAssetViewerDialog class={cn('w-full', className)} {onSelect}>
		{@render FilePromptButton({
			label: label,
			description: description,
			imageSrc: PromptInspoImage,
			imageAlt: 'A modern living room space'
		})}
	</DesignAssetViewerDialog>
{/if}

{#if type === 'floorplan'}
	<DesignAssetUploadDialog
		class={cn('w-full', className)}
		type="floorplan"
		title="Upload floor plan"
		accept=".jpg, .jpeg, .png, .pdf"
		onUpload={onSelect}
	>
		{@render FilePromptButton({
			label: label,
			description: description,
			imageSrc: PromptFloorPlanImage,
			imageAlt: 'Floor plan'
		})}
	</DesignAssetUploadDialog>
{/if}

{#snippet FilePromptButton({
	label,
	description,
	imageSrc,
	imageAlt
}: {
	label: string;
	description?: string;
	imageSrc: string;
	imageAlt: string;
})}
	<div
		class="items start relative inline-flex h-auto w-full cursor-pointer items-center justify-between gap-x-20 rounded-lg border border-color-action-border-muted bg-color-action-background p-1 pl-2 text-sm font-medium whitespace-nowrap text-color-action-text ring-2 ring-color-focus-ring-muted active:opacity-50 disabled:cursor-not-allowed disabled:border-1 disabled:opacity-50 disabled:ring-0"
	>
		<p class="text-start text-sm text-wrap">
			<span class="block font-semibold">{label}</span>
			{#if !!description}
				<span class="block text-xs text-color-action-text-muted">{description}</span>
			{/if}
		</p>

		<img class="h-20 w-20 rounded-md object-cover" src={imageSrc} alt={imageAlt} />
	</div>
{/snippet}
