<script lang="ts">
	import { usePaymentAction } from '$lib/client/actions/use-payment.action.svelte';
	import FulhausLoader from '$lib/components/loaders/fulhaus-loader.svelte';
	import type { AppSubscriptionPlan } from '$lib/types';
	import { cn } from '$lib/utils/cn';
	import { BadgeCheckIcon } from '@lucide/svelte';

	type PricingPlan = {
		name: AppSubscriptionPlan;
		priceUSD: number;
		tokensIncluded: number;
		approximateRoomValue: number;
		additionalTokensPrice: number;
		recommended: boolean;
	};

	const pricingPlans: PricingPlan[] = [
		{
			name: 'Free',
			priceUSD: 0,
			tokensIncluded: 400,
			approximateRoomValue: 2,
			additionalTokensPrice: 0.025,
			recommended: false
		},
		{
			name: 'Creator',
			priceUSD: 25,
			tokensIncluded: 2000,
			approximateRoomValue: 10,
			additionalTokensPrice: 0.02,
			recommended: true
		},
		{
			name: 'Professional',
			priceUSD: 50,
			tokensIncluded: 5000,
			approximateRoomValue: 25,
			additionalTokensPrice: 0.015,
			recommended: false
		},
		{
			name: 'Teams',
			priceUSD: 100,
			tokensIncluded: 10000,
			approximateRoomValue: 50,
			additionalTokensPrice: 0.012,
			recommended: false
		},
		{
			name: 'Enterprise',
			priceUSD: 150,
			tokensIncluded: 20000,
			approximateRoomValue: 100,
			additionalTokensPrice: 0.01,
			recommended: false
		}
	];

	const { paymentActionState, handleCreditSubscriptionCheckout } = usePaymentAction();
</script>

{#if paymentActionState.loading}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-color-action-background/70">
		<FulhausLoader class="fill-color-action-text" />
	</div>
{/if}

<section class="scrollbar-thin h-full w-full overflow-y-auto p-4">
	<div class="w-full space-y-12 py-12 lg:mx-auto lg:max-w-fit">
		<div>
			<h1>Pricing</h1>
			<p class="text-color-text-muted">
				Choose a plan that works for you<br />~200 tokens/room
			</p>
		</div>

		<div class="grod-cols-1 grid gap-16 lg:grid-cols-3">
			{#each pricingPlans as pricingPlan (pricingPlan.name)}
				<button
					class={cn(
						'hover:ring-border-color-action-border w-full cursor-pointer space-y-8 rounded-lg border border-color-border-muted p-8 text-start hover:border-color-action-border hover:bg-color-background-surface hover:ring-2 lg:w-72',
						pricingPlan.recommended && 'ring-border-color-action-border ring-2'
					)}
					type="button"
					disabled={paymentActionState.loading}
					onclick={() => handleCreditSubscriptionCheckout(pricingPlan.name)}
				>
					<div class="space-y-8 text-center">
						<h3>{pricingPlan.name}</h3>
						<p class="text-4xl leading-none">
							${pricingPlan.priceUSD}<sup
								class={cn('text-xs', pricingPlan.name === 'Free' && 'hidden')}>/month</sup
							>
							<span class="mt-1 block text-sm font-normal text-color-text-muted"
								>Then <span class="font-medium text-color-text"
									>${pricingPlan.additionalTokensPrice}</span
								> per credit</span
							>
						</p>
					</div>

					<div class="space-y-4">
						{@render PricingPlanFeature(
							`${pricingPlan.tokensIncluded} credits included`,
							pricingPlan.approximateRoomValue
						)}
						{@render PricingPlanFeature('Unlimited designs')}
						{@render PricingPlanFeature('Unlimited visualizations')}
						{@render PricingPlanFeature('Unlimited users')}
					</div>

					<div
						class="flex h-10 w-full items-center justify-center rounded-md bg-color-action-background font-medium text-color-action-text lg:hidden"
					>
						Subscribe
					</div>
				</button>
			{/each}
		</div>
	</div>
</section>

{#snippet PricingPlanFeature(label: string, approximateRoomValue?: number)}
	<div class={cn('flex items-center gap-x-2', approximateRoomValue !== undefined && 'items-start')}>
		<BadgeCheckIcon />
		<p>
			{label}<span class={cn('block text-xs', approximateRoomValue === undefined && 'hidden')}
				>~{approximateRoomValue} rooms</span
			>
		</p>
	</div>
{/snippet}
