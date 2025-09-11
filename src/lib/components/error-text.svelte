<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import type { HTMLAttributes } from 'svelte/elements';

	type ErrorTextProps = {
		error: string;
	} & Omit<HTMLAttributes<HTMLElement>, 'children'>;

	const { class: className = '', error, ...otherErrorTextProps }: ErrorTextProps = $props();
</script>

<small class={cn('block text-xs text-color-error-text', className)} {...otherErrorTextProps}>
	{error}
</small>
