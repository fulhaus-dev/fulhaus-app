<script lang="ts">
	import Button from '$lib/components/button.svelte';
	import ErrorText from '$lib/components/error-text.svelte';
	import { cn } from '$lib/utils/cn';
	import { XIcon } from '@lucide/svelte';

	type DesignAssetUploadErrorProps = { class?: string; error?: string; onclose?: () => void };

	const { class: className = '', error, onclose }: DesignAssetUploadErrorProps = $props();
</script>

{#if !!error}
	<div
		class={cn(
			'absolute inset-0 z-10 flex flex-col items-center gap-y-2 bg-color-background/80 text-sm font-medium',
			className
		)}
	>
		<div class="sticky top-40 space-y-8 p-20 text-center">
			<ErrorText {error} />
			<Button class="h-8 w-fit bg-color-background" variant="outlined" onclick={onclose}>
				<XIcon /> Close
			</Button>
		</div>
	</div>
{/if}
