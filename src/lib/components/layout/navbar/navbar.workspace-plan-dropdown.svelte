<script lang="ts">
	import {
		useCurrentWorkspaceQuery,
		useWorkspacePlanQuery
	} from '$lib/client/queries/use-workspace.query.svelte';
	import Tooltip from '$lib/components/tooltip.svelte';
	import { cn } from '$lib/utils/cn';
	import { DropdownMenu } from 'bits-ui';

	const currentWorkspaceQuery = useCurrentWorkspaceQuery();
	const currentWorkspace = $derived(currentWorkspaceQuery.currentWorkspace);

	const workspacePlanQuery = useWorkspacePlanQuery();
	const workspacePlan = $derived(workspacePlanQuery.workspacePlan);
	const workspacePlanCreditPercentage = $derived(
		workspacePlan ? 100 - (workspacePlan.used / workspacePlan.credit) * 100 : 0
	);
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger class="cursor-pointer active:opacity-50">
		{#if workspacePlan}
			<Tooltip content={`${workspacePlan.used} / ${workspacePlan.credit} credits used`}>
				<div class="relative size-4 rounded-full">
					<svg
						class={cn(
							'size-full -rotate-90 rounded-full stroke-4',
							workspacePlanCreditPercentage <= 25 && 'text-red-500',
							workspacePlanCreditPercentage > 25 && 'text-yellow-500',
							workspacePlanCreditPercentage >= 50 && 'text-green-500'
						)}
						viewBox="0 0 36 36"
						xmlns="http://www.w3.org/2000/svg"
					>
						<circle
							cx="18"
							cy="18"
							r="16"
							fill="none"
							class="stroke-current text-current opacity-20"
						></circle>

						<circle
							cx="18"
							cy="18"
							r="16"
							fill="none"
							class="stroke-current text-current"
							stroke-dasharray="100"
							stroke-dashoffset={`${workspacePlanCreditPercentage - 100}`}
							stroke-linecap="round"
						></circle>
					</svg>

					<div
						class={cn(
							'absolute start-1/2 top-1/2 size-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-full',
							workspacePlanCreditPercentage <= 25 && 'bg-red-500',
							workspacePlanCreditPercentage > 25 && 'bg-yellow-500',
							workspacePlanCreditPercentage >= 50 && 'bg-green-500'
						)}
					></div>
				</div>
			</Tooltip>
		{/if}
	</DropdownMenu.Trigger>

	<DropdownMenu.Portal>
		<DropdownMenu.Content
			class="z-50 w-[80vw] min-w-52 rounded-md border border-color-border-muted bg-color-background p-4 text-sm shadow-xs shadow-color-shadow-muted lg:w-96"
			align="end"
			sideOffset={8}
		>
			<div class="space-y-2">
				<div>
					<h4 class="text-sm font-medium">Workspace credits</h4>
					<p class="text-[10px] font-medium text-color-text-muted">
						{`${workspacePlan.used} / ${workspacePlan.credit} credits used`}
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
		</DropdownMenu.Content>
	</DropdownMenu.Portal>
</DropdownMenu.Root>
