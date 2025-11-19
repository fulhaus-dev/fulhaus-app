<script lang="ts">
	import { usePaymentAction } from '$lib/client/actions/use-payment.action.svelte';
	import Button from '$lib/components/button.svelte';
	import FulhausLoader from '$lib/components/loaders/fulhaus-loader.svelte';
	import PricingPlanFeature from '$lib/components/pricing/pricing-plan-feature.svelte';
	import { XIcon } from '@lucide/svelte';
	import { Dialog } from 'bits-ui';
	import type { Snippet } from 'svelte';

	const { children }: { children: Snippet } = $props();

	let open = $state(false);
	let price = $state(10);

	const { paymentActionState, handleCreditOneOffPaymentCheckout } = usePaymentAction();
</script>

{#if paymentActionState.loading}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-color-action-background/70">
		<FulhausLoader class="fill-color-action-text" />
	</div>
{/if}

<Dialog.Root bind:open>
	<Dialog.Trigger>
		{@render children()}
	</Dialog.Trigger>
	<Dialog.Portal>
		<Dialog.Overlay
			class="fixed inset-0 z-50 bg-color-overlay-background data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0"
		/>

		<Dialog.Content
			class="fixed top-[50%] left-[50%] z-50 w-full max-w-[40rem] translate-x-[-50%] translate-y-[-50%] p-4 outline-hidden data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 lg:p-0"
		>
			<div class="sticky top-1 right-1 z-10 flex justify-end lg:hidden">
				<Dialog.Close class="rounded-full bg-white p-1">
					<XIcon class="h-4 w-4" />
				</Dialog.Close>
			</div>

			<div class="rounded-md bg-color-background pb-4">
				<div class="rounded-md bg-color-background-surface px-4 py-4 lg:px-8">
					<h2>Free plan</h2>
				</div>

				<div class="space-y-8 px-4 py-4 lg:px-8">
					<div>
						<h3>Buy Credits</h3>
						<p class="text-color-text-muted">~ 200 credits/room</p>
					</div>

					<div class="space-y-4">
						<div>
							<p class="text-4xl leading-none">${price}</p>
							<input
								id="default-range"
								type="range"
								min="5"
								max="100"
								bind:value={price}
								step="5"
								class="h-1 w-full cursor-pointer appearance-none rounded-full bg-color-action-background"
							/>
						</div>

						<div class="space-y-4">
							<PricingPlanFeature
								label={`${price / 0.025} credits`}
								approximateRoomValue={price / 5}
							/>
						</div>
					</div>

					<Button
						onclick={() => {
							handleCreditOneOffPaymentCheckout(price);
							open = false;
						}}
					>
						<span>Buy {price / 0.025} Credits</span>
					</Button>
				</div>
			</div>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
