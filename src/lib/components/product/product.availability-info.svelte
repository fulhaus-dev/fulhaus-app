<script lang="ts">
	import { cn } from '$lib/utils/cn';

	type ProductAvailabilityInfoProps = {
		stockQty: number;
		restockDate?: number;
	};

	const { stockQty, restockDate }: ProductAvailabilityInfoProps = $props();
</script>

<div>
	<p
		class={cn(
			'rounded-full border px-2 text-[10px] font-medium',
			stockQty < 1 && 'border-color-error-border bg-color-error-background text-color-error-text',
			stockQty > 0 &&
				'border-color-warning-border bg-color-warning-background text-color-warning-text',
			stockQty > 10 &&
				'border-color-success-border bg-color-success-background text-color-success-text'
		)}
	>
		{stockQty > 10 ? 'In stock' : stockQty > 0 ? 'Low stock' : 'Out of stock'}
	</p>

	{#if stockQty < 1 && restockDate}
		<p>{new Date(restockDate).toLocaleDateString('en-US')}</p>
	{/if}
</div>
