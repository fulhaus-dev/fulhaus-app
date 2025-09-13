<script lang="ts">
	import ErrorText from '$lib/components/error-text.svelte';
	import Label from '$lib/components/label.svelte';
	import { cn } from '$lib/utils/cn';
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	type TextAreaProps = {
		label?: string;
		optional?: boolean;
		error?: string;
	} & HTMLTextareaAttributes;

	let {
		id,
		class: className = '',
		label,
		optional = false,
		value = $bindable(),
		error = $bindable(),
		oninput,
		onblur,
		...otherTextAreaProps
	}: TextAreaProps = $props();

	let showError = $state(false);

	function handleInput(e: Event & { currentTarget: EventTarget & HTMLTextAreaElement }) {
		showError = false;
		oninput?.(e);
	}

	function handleBlur(e: FocusEvent & { currentTarget: EventTarget & HTMLTextAreaElement }) {
		showError = true;
		onblur?.(e);
	}
</script>

{#if !!label}
	<Label for={id} class="mb-2 ml-px">
		{label}

		{#if optional}
			<small class="text-xs text-color-text-muted"> (Optional)</small>
		{/if}
	</Label>
{/if}

<textarea
	{id}
	data-slot="textarea"
	class={cn(
		'field-sizing-content min-h-20 w-full resize-none rounded-md border border-color-border bg-color-background-surface px-4 py-2 outline-none placeholder:text-color-text-placeholder invalid:border-color-error-border focus-visible:border-color-border focus-visible:ring-2 focus-visible:ring-color-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-color-background focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-color-error-border ',
		className
	)}
	bind:value
	onblur={handleBlur}
	oninput={handleInput}
	{...otherTextAreaProps}
></textarea>

{#if showError && !!error}
	<ErrorText class="ml-2" {error} />
{/if}
