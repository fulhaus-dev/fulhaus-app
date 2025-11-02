<script lang="ts">
	import { cn } from '$lib/utils/cn';

	type DesignTagButtonProps = {
		tag: string;
		onDelete?: () => void;
	};

	const { tag, onDelete }: DesignTagButtonProps = $props();
</script>

<button
	class={cn(
		'rounded-full border border-color-action-border bg-color-action-background px-2 py-px text-[10px] font-semibold text-color-action-text ',
		onDelete &&
			'cursor-pointer hover:border-color-error-border hover:bg-color-error-background hover:text-color-error-text hover:line-through '
	)}
	type="button"
	onclick={() => onDelete?.()}
>
	{tag}
</button>
