<script lang="ts">
	import { goto } from '$app/navigation';
	import { useWorkspacePlanQuery } from '$lib/client/queries/use-workspace.query.svelte';
	import Button from '$lib/components/button.svelte';

	const { onManagePlan }: { onManagePlan?: () => void } = $props();

	const workspacePlanQuery = useWorkspacePlanQuery();
	const workspacePlan = $derived(workspacePlanQuery.workspacePlan);
</script>

<Button
	class="mt-4 h-10"
	onclick={() => {
		onManagePlan?.();
		goto(`/${workspacePlan?.workspaceId}/pricing?${workspacePlanQuery.planRedirectQuery}`);
	}}
>
	Manage Plan / Add Credits
</Button>
