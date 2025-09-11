<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import type { HTMLLabelAttributes } from 'svelte/elements';

	let { children, class: className = '', ...restLabelProps }: HTMLLabelAttributes = $props();
</script>

<label
	class={cn(
		'block text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
		className
	)}
	data-slot="label"
	{...restLabelProps}
>
	{@render children?.()}
</label>
