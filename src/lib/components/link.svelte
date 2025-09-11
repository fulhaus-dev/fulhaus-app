<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	const { children, class: className = '', ...otherLinkProps }: HTMLAnchorAttributes = $props();
</script>

<a class={cn('block font-medium active:opacity-50', className)} {...otherLinkProps}>
	{@render children?.()}
</a>
