<script lang="ts">
	import { cn } from '$lib/utils/cn';

	import type { HTMLInputAttributes } from 'svelte/elements';

	let {
		class: className = '',
		value = $bindable(),
		...otherCheckboxAttributes
	}: Omit<HTMLInputAttributes, 'type'> = $props();
</script>

<input
	class={cn(
		'size-4 rounded-sm border-color-border ring-1 ring-color-focus-ring outline-0 focus:ring-0',
		className
	)}
	type="checkbox"
	{value}
	{...otherCheckboxAttributes}
/>
