<script lang="ts">
	import { goto } from '$app/navigation';
	import { useWorkspacePlanQuery } from '$lib/client/queries/use-workspace.query.svelte';
	import Link from '$lib/components/link.svelte';
	import PricingPlanFeature from '$lib/components/pricing/pricing-plan-feature.svelte';
	import type { AppSubscriptionPlan } from '$lib/types';
	import { cn } from '$lib/utils/cn';

	type PricingPlan = {
		name: AppSubscriptionPlan;
		description: string;
		priceUSD: number;
		tokensIncluded: number;
		monthlyFreeTokens?: number;
		approximateRoomValue: number;
		additionalTokensPrice: number;
		recommended: boolean;
	};

	const freePlan: PricingPlan = {
		name: 'Free',
		description: 'Get a feel of Fulhaus designer',
		priceUSD: 0,
		tokensIncluded: 1000,
		approximateRoomValue: 5,
		additionalTokensPrice: 0.025,
		recommended: false
	};

	const pricingPlans: PricingPlan[] = [
		{
			name: 'Creator',
			description: 'For creators making premium designs',
			priceUSD: 25,
			tokensIncluded: 2000,
			approximateRoomValue: 10,
			additionalTokensPrice: 0.02,
			recommended: false
		},
		{
			name: 'Professional',
			description: 'For designers & businesses with large projects',
			priceUSD: 50,
			tokensIncluded: 5000,
			approximateRoomValue: 25,
			additionalTokensPrice: 0.015,
			recommended: false
		}
		// {
		// 	name: 'Teams',
		// 	priceUSD: 100,
		// 	tokensIncluded: 10000,
		// 	approximateRoomValue: 50,
		// 	additionalTokensPrice: 0.012,
		// 	recommended: false
		// },
		// {
		// 	name: 'Enterprise',
		// 	priceUSD: 150,
		// 	tokensIncluded: 20000,
		// 	approximateRoomValue: 100,
		// 	additionalTokensPrice: 0.01,
		// 	recommended: false
		// }
	];

	const pricingPlanClass: Record<AppSubscriptionPlan, number> = {
		Free: 0,
		Creator: 1,
		Professional: 2,
		Teams: 3,
		Enterprise: 4
	};

	const workspacePlanQuery = useWorkspacePlanQuery();
	const workspacePlan = $derived(workspacePlanQuery.workspacePlan);
</script>

<section class="scrollbar-thin h-full w-full overflow-y-auto p-4">
	<div class="w-full space-y-12 py-12 lg:mx-auto lg:max-w-fit">
		<div>
			<h1>Pricing</h1>
			<p class="text-color-text-muted">
				Choose a plan that works for you<br />~200 credits/room
			</p>
		</div>

		<div class="grod-cols-1 grid gap-16 lg:grid-cols-3">
			{@render PricingPlanCard({
				pricingPlan: freePlan
			})}

			{#each pricingPlans as pricingPlan (pricingPlan.name)}
				{@render PricingPlanCard({
					pricingPlan
				})}
			{/each}
		</div>

		<div class="border-t border-color-border-muted py-12 text-center">
			<h3>Custom Plan?</h3>
			<Link
				class="underline underline-offset-2"
				href="https://www.fulhaus.com/contact-us"
				target="_blank">Contact us</Link
			>
		</div>
	</div>
</section>

{#snippet PricingPlanCard({ pricingPlan }: { pricingPlan: PricingPlan })}
	<button
		class={cn(
			'hover:ring-border-color-action-border relative w-full cursor-pointer space-y-8 rounded-lg border border-color-border-muted p-8 text-start  lg:w-80',
			pricingPlan.name !== workspacePlan?.plan &&
				'ring-border-color-action-border ring-2 hover:border-color-action-border hover:bg-color-background-surface hover:ring-2'
		)}
		type="button"
		onclick={() => goto('/')}
	>
		<div class="space-y-8 text-center">
			<div>
				<h3>{pricingPlan.name}</h3>
				<p class="text-xs text-color-text-muted">{pricingPlan.description}</p>
			</div>

			<p class="text-4xl leading-none">
				${pricingPlan.priceUSD}<sup class={cn('text-xs', pricingPlan.name === 'Free' && 'hidden')}
					>/month</sup
				>

				<span class="mt-1 block text-sm font-normal text-color-text-muted"
					>Then <span class="font-medium text-color-text">${pricingPlan.additionalTokensPrice}</span
					> per credit</span
				>
			</p>
		</div>

		<div class="space-y-4">
			<PricingPlanFeature
				label={`${pricingPlan.tokensIncluded} credits included`}
				approximateRoomValue={pricingPlan.approximateRoomValue}
			/>
			<PricingPlanFeature label="Unlimited designs" />
			<PricingPlanFeature label="Unlimited visualizations" />
			<PricingPlanFeature label="Unlimited users" />
		</div>

		<div>
			{#if pricingPlan.name === workspacePlan?.plan}
				<div
					class={cn(
						'flex w-full flex-col items-center justify-center rounded-md border border-color-border p-2 text-center font-medium',
						pricingPlan.name !== 'Free' && 'opacity-50'
					)}
				>
					{#if pricingPlan.name === 'Free'}
						<p>Your Current Plan</p>
						<small class="opacity-80">
							Buy additional credits ({`${pricingPlan.additionalTokensPrice} per credit`})
						</small>
					{:else}
						<p>Your Current Plan</p>
					{/if}
				</div>
			{/if}

			{#if pricingPlan.name !== workspacePlan?.plan}
				<div
					class="flex w-full items-center justify-center rounded-md bg-color-action-background p-2 font-medium text-color-action-text"
				>
					{#if pricingPlanClass[pricingPlan.name] > pricingPlanClass[workspacePlan?.plan || 'Free']}
						<p>Get Stared</p>
					{:else}
						<p>Get Stared</p>
					{/if}
				</div>
			{/if}

			{#if pricingPlan.monthlyFreeTokens}
				<p class="mt-1 text-center text-xs text-color-text-muted">
					Free {pricingPlan.monthlyFreeTokens} credits monthly
				</p>
			{/if}
		</div>
	</button>
{/snippet}
