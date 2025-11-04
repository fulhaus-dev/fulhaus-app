<script lang="ts">
	import { useWorkspacePlanQuery } from '$lib/client/queries/use-workspace.query.svelte';
	import { cn } from '$lib/utils/cn';

	const { label }: { label: string } = $props();

	const workspacePlanQuery = useWorkspacePlanQuery();
	const workspacePlan = $derived(workspacePlanQuery.workspacePlan);
	const workspacePlanCreditPercentage = $derived(
		workspacePlan ? 100 - (workspacePlan.used / workspacePlan.credit) * 100 : 0
	);
</script>

<div class="w-full space-y-2">
	<div class="space-y-1">
		<h4 class="text-xs font-medium">{label}</h4>
		<p class="text-[10px] font-medium text-color-text-muted">
			{`${workspacePlan?.used} / ${workspacePlan?.credit} credits used`}
		</p>
	</div>

	<div
		class={cn(
			'flex w-full items-center gap-x-2',
			workspacePlanCreditPercentage <= 25 && 'text-red-500',
			workspacePlanCreditPercentage > 25 && 'text-yellow-500',
			workspacePlanCreditPercentage >= 50 && 'text-green-500'
		)}
	>
		<div
			class="flex h-1.5 w-full overflow-hidden rounded-full bg-gray-200"
			role="progressbar"
			aria-valuenow="25"
			aria-valuemin="0"
			aria-valuemax="100"
		>
			<div
				class={cn(
					'h-full overflow-hidden rounded-full',
					workspacePlanCreditPercentage <= 25 && 'bg-red-500',
					workspacePlanCreditPercentage > 25 && 'bg-yellow-500',
					workspacePlanCreditPercentage >= 50 && 'bg-green-500'
				)}
				style="width: {workspacePlanCreditPercentage}%"
			></div>
		</div>

		{#if workspacePlanCreditPercentage < 100}
			<p class="text-[10px] leading-none font-medium text-nowrap">
				{`${100 - workspacePlanCreditPercentage}% used`}
			</p>
		{/if}
	</div>
</div>
