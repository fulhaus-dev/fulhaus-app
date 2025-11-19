<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { BadgeCheckIcon } from '@lucide/svelte';

	type PricingPlanFeatureProps = {
		label: string;
		approximateRoomValue?: number;
	};

	const { label, approximateRoomValue }: PricingPlanFeatureProps = $props();
</script>

<div class={cn('flex items-center gap-x-2', approximateRoomValue !== undefined && 'items-start')}>
	<BadgeCheckIcon />
	<p>
		{label}<span class={cn('block text-xs', approximateRoomValue === undefined && 'hidden')}
			>~{approximateRoomValue} room{approximateRoomValue === 1 ? '' : 's'}</span
		>
	</p>
</div>
