<script lang="ts">
	import { page } from '$app/state';
	import { DropdownMenu } from 'bits-ui';
	import asyncFetch from '$lib/utils/async-fetch';
	import type { CurrencyCode } from '$lib/types';
	import FulhausLoader from '$lib/components/loaders/fulhaus-loader.svelte';

	const currencyCode = page.data.currencyCode;
	let changingCurrency = $state(false);

	async function setCurrencyCode(currencyCode: string) {
		changingCurrency = true;

		const { error } = await asyncFetch.post('/api/currency/cookies/set', {
			body: JSON.stringify({ currencyCode }),
			headers: { 'Content-Type': 'application/json' }
		});

		if (error) {
			changingCurrency = false;
			return;
		}

		window.location.reload();
	}
</script>

{#if changingCurrency}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-color-overlay-background">
		<FulhausLoader />
	</div>
{/if}

<DropdownMenu.Root>
	<DropdownMenu.Trigger class="cursor-pointer active:opacity-50">
		<span class="text-xs font-medium">
			{currencyCode}
		</span>
	</DropdownMenu.Trigger>

	<DropdownMenu.Portal>
		<DropdownMenu.Content
			class="z-50 min-w-32 space-y-2 rounded-md border border-color-border-muted bg-color-background text-sm shadow-xs shadow-color-shadow-muted"
			align="end"
			sideOffset={8}
		>
			<DropdownMenu.Group class="space-y-4 bg-color-background-surface px-4 py-1">
				<h5 class="text-xs font-medium text-color-text-muted">Change Currency</h5>
			</DropdownMenu.Group>

			<DropdownMenu.Group>
				{@render MenuItem({ currencyCode: 'CAD' })}
				{@render MenuItem({ currencyCode: 'USD' })}
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Portal>
</DropdownMenu.Root>

{#snippet MenuItem({ currencyCode }: { currencyCode: CurrencyCode })}
	<DropdownMenu.Item
		class="flex h-10 w-full cursor-pointer items-center gap-x-2 rounded-md px-4 text-xs hover:bg-color-background-surface"
		onSelect={() => setCurrencyCode(currencyCode)}
	>
		<p>{currencyCode}</p>
	</DropdownMenu.Item>
{/snippet}
