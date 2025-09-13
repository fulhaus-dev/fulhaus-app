<script lang="ts">
	import Button from '$lib/components/button.svelte';
	import UploadFromDeviceIcon from '$lib/components/svgs/upload-from-device-icon.svelte';
	import TextInput from '$lib/components/text-input.svelte';
	import { cn } from '$lib/utils/cn';
	import z from 'zod';

	type FileUploadProps = {
		class?: string;
		title?: string;
		maxSizeMb?: number;
		accept?: string;
		multiple?: boolean;
		onUploadFile?: (files: File[]) => void;
		onUploadUrl?: (value: string) => void;
	};

	let {
		class: className = '',
		title,
		accept,
		maxSizeMb,
		multiple = true,
		onUploadFile = () => {},
		onUploadUrl = () => {}
	}: FileUploadProps = $props();

	const acceptInfo = $derived(
		accept
			?.split(',')
			.map((ext) => ext.toUpperCase())
			.join(' | ')
	);
	const maxSizeMbInfo = $derived(
		maxSizeMb ? `${acceptInfo ? 'u' : 'U'}p to ${maxSizeMb}MB` : undefined
	);

	let uploadFiles = $state<string>();
	let urlValue = $state<string>();

	const isValidUrl = $derived.by(() => {
		return z.url().safeParse(urlValue).success;
	});

	function handleFileUpload(
		event: Event & {
			currentTarget: EventTarget & HTMLInputElement;
		}
	) {
		const target = event.target as HTMLInputElement;
		const fileList = target.files;

		if (!fileList) return;

		onUploadFile(Array.from(fileList));
	}

	function handleUrlUpload() {
		if (!urlValue) return;

		onUploadUrl(urlValue);
	}
</script>

<div
	class={cn('w-full max-w-[40rem] space-y-8 rounded-md bg-color-background-surface p-8', className)}
>
	<div class="space-y-4">
		{#if !!title}
			<h3>{title}</h3>
		{/if}

		<div
			class="relative w-full justify-items-center rounded-md border border-dashed border-color-border bg-color-background px-2 py-8"
		>
			<UploadFromDeviceIcon />
			<p class="mt-4">Drag and drop or click to upload</p>

			{#if acceptInfo && maxSizeMbInfo}
				<small class="text-color-text-muted"
					>{`${acceptInfo ? `${acceptInfo} ` : ''}${maxSizeMbInfo}`}</small
				>
			{/if}

			<input
				class="absolute inset-0 z-1 cursor-pointer opacity-0"
				type="file"
				{accept}
				{multiple}
				bind:value={uploadFiles}
				onchange={handleFileUpload}
			/>
		</div>
	</div>

	<div class="relative flex items-center gap-x-2">
		<TextInput
			class="bg-color-background pr-44 text-sm"
			type="url"
			bind:value={urlValue}
			placeholder="Or enter a File URL"
		/>

		<Button
			class={cn(
				'absolute right-1 h-10 w-40 opacity-0 ring-0 transition-opacity duration-300',
				isValidUrl && 'opacity-100'
			)}
			onclick={handleUrlUpload}>Upload from URL</Button
		>
	</div>
</div>
