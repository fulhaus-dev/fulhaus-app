<script lang="ts">
	import TextInput from '$lib/components/text-input.svelte';
	import { cn } from '$lib/utils/cn';

	type PinInputProps = {
		id?: string;
		name?: string;
		class?: string;
		length?: number;
		type?: 'text' | 'number' | 'password';
		pin?: string;
		error?: string;
	};

	let {
		class: className = '',
		type = 'number',
		length = 6,
		pin = $bindable(),
		error,
		...otherPinInputProps
	}: PinInputProps = $props();

	let isFocused = $state(false);
	let showError = $state(false);

	let pinValue = $derived(pin);

	function oninput() {
		showError = false;
	}

	function onpaste(event: ClipboardEvent & { currentTarget: EventTarget & HTMLInputElement }) {
		event.preventDefault();

		const pastedPin = event.clipboardData?.getData('text');
		const cleanedPin = pastedPin?.trim().replace(/\s+/g, '');

		pin = cleanedPin?.slice(0, length) ?? '';
	}

	function onblur() {
		showError = true;
		isFocused = false;
	}
</script>

<div class="relative">
	<!-- using tel input type for number to ensure maxlength works  -->
	<input
		class="absolute inset-0 z-10 block h-full w-full opacity-0"
		data-slot="pin-input"
		bind:value={pin}
		type={type === 'number' ? 'text' : type}
		aria-label="Enter PIN code"
		autocomplete="one-time-code"
		maxlength={length}
		max={length}
		inputmode={type === 'number' ? 'numeric' : 'text'}
		onfocus={() => (isFocused = true)}
		{onpaste}
		{onblur}
		{oninput}
		{...otherPinInputProps}
	/>

	<div class="flex w-full items-center justify-center gap-x-2">
		{#each Array.from({ length }, (_, index) => index) as index (index)}
			<div class="relative">
				<TextInput
					class={cn(
						'text-center text-2xl',
						className,
						isFocused &&
							((pinValue?.length ?? 0) === index ||
								((pinValue?.length ?? 0) === length && index === length - 1)) &&
							'ring-2 ring-color-focus-ring'
					)}
					aria-hidden="true"
					value={pinValue?.[index] ?? ''}
				/>

				<!-- Cursor -->
				{#if isFocused && (pinValue?.length ?? 0) === index}
					<div
						class="absolute inset-0 z-1 flex animate-caret-blink items-center justify-center py-2"
					>
						<div class="h-full w-px bg-color-text"></div>
					</div>
				{/if}
			</div>
		{/each}
	</div>

	{#if showError && !!error}
		<small class="ml-px text-xs text-color-error-text">{error}</small>
	{/if}
</div>
