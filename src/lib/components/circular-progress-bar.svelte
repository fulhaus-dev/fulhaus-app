<script lang="ts">
	import { cn } from '$lib/utils/cn';

	type CircularProgressBarProps = {
		class?: string;
		progressPercentage?: number;
	};

	const { class: className = '', progressPercentage = 0 }: CircularProgressBarProps = $props();
</script>

<div class="relative">
	<svg
		class={cn('size-8 stroke-4 text-blue-500', className, '-rotate-90 rounded-full')}
		viewBox="0 0 36 36"
		xmlns="http://www.w3.org/2000/svg"
	>
		<!-- Background Circle -->
		<circle cx="18" cy="18" r="16" fill="none" class="stroke-current text-current opacity-20"
		></circle>
		<!-- Progress Circle -->
		<circle
			cx="18"
			cy="18"
			r="16"
			fill="none"
			class="stroke-current text-current"
			stroke-dasharray="100"
			stroke-dashoffset={`${100 - progressPercentage}`}
			stroke-linecap="round"
		></circle>
	</svg>
</div>
