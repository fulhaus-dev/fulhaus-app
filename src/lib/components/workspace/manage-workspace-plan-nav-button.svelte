<script lang="ts">
	import { goto } from '$app/navigation';
	import { useWorkspacePlanQuery } from '$lib/client/queries/use-workspace.query.svelte';
	import Button, { type ButtonVariant } from '$lib/components/button.svelte';
	import { cn } from '$lib/utils/cn';

	const {
		onManagePlan,
		class: className = '',
		variant = 'filled'
	}: { class?: string; variant?: ButtonVariant; onManagePlan?: () => void } = $props();

	const workspacePlanQuery = useWorkspacePlanQuery();
	const workspacePlan = $derived(workspacePlanQuery.workspacePlan);
</script>

<Button
	class={cn('h-10', className)}
	{variant}
	onclick={() => {
		onManagePlan?.();
		goto(`/${workspacePlan?.workspaceId}/pricing?${workspacePlanQuery.planRedirectQuery}`);
	}}
>
	Manage Plan / Add Credits
</Button>
