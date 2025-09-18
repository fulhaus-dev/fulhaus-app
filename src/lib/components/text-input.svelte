<script lang="ts">
	import ErrorText from '$lib/components/error-text.svelte';
	import Label from '$lib/components/label.svelte';
	import { cn } from '$lib/utils/cn';
	import type { WithElementRef } from 'bits-ui';

	import type { HTMLInputAttributes } from 'svelte/elements';

	type TextInputProps = {
		type?: 'text' | 'email' | 'number' | 'password' | 'search' | 'url' | 'tel';
		label?: string;
		optional?: boolean;
		error?: string;
	} & Omit<HTMLInputAttributes, 'type'>;

	let {
		ref = $bindable(null),
		id,
		class: className = '',
		type,
		label,
		optional = false,
		value = $bindable(),
		error = $bindable(),
		oninput,
		onblur,
		...otherTextInputProps
	}: WithElementRef<TextInputProps> = $props();

	let showError = $state(false);

	function handleInput(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		showError = false;
		oninput?.(e);
	}

	function handleBlur(e: FocusEvent & { currentTarget: EventTarget & HTMLInputElement }) {
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

<input
	bind:this={ref}
	{id}
	class={cn(
		'h-12 w-full rounded-md border border-color-border bg-color-background-surface px-4 placeholder:text-color-text-muted invalid:border-color-error-border focus-visible:border-color-border focus-visible:ring-2 focus-visible:ring-color-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-color-background focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-color-error-border',
		className
	)}
	data-slot="input"
	{type}
	bind:value
	inputmode={type === 'number' ? 'numeric' : undefined}
	onblur={handleBlur}
	oninput={handleInput}
	{...otherTextInputProps}
/>

{#if showError && !!error}
	<ErrorText class="ml-2" {error} />
{/if}
