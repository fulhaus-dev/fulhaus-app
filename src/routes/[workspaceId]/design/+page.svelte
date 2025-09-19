<script lang="ts">
	import { useDesignPage } from '$lib/client-hooks/use-design-page.svelte';
	import Button from '$lib/components/button.svelte';
	import { cn } from '$lib/utils/cn';
	import { Icon } from '@lucide/svelte';

	const { designPage } = useDesignPage();

	const design = $derived(designPage.design);
	const designProducts = $derived(designPage.designProducts);
</script>

<section class="h-full w-full p-2">
	<div class="h-full w-full rounded-md border border-color-border">
		<div class="flex h-[2.4rem] items-center justify-between border-b border-color-border px-8">
			<h4 class="text-sm font-medium">{design.name}</h4>
		</div>

		<div class="flex h-[calc(100%-2.4rem)] w-full items-center overflow-y-scroll pt-80 pb-40">
			<div class="mx-auto grid h-auto w-full max-w-[1200px] grid-cols-4 gap-2">
				{#each designProducts as designProduct (designProduct._id)}
					<div
						class="relative h-80 w-full rounded-md border border-color-border-muted bg-color-background-surface"
					>
						<img
							class="h-full w-full rounded-md object-cover"
							src={designProduct.imageUrl}
							alt={designProduct.name}
						/>

						<div
							class="absolute right-0 bottom-0 left-0 rounded-b-md bg-color-background/80 px-4 py-2 text-xs font-medium"
						>
							<h3 class="text-lg">{designProduct.category}</h3>
							<p>
								{designProduct.name}
							</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

{#snippet TabButton({
	label,
	TabIcon,
	active,
	onclick
}: {
	label: string;
	TabIcon: typeof Icon;
	active: boolean;
	onclick: () => void;
})}
	<Button
		class={cn(
			'h-[1.6rem] rounded-sm border-1 border-color-border text-xs ring-4 transition-colors duration-300',
			!active && 'text-color-text-muted ring-2'
		)}
		variant={active ? 'filled' : 'outlined'}
		{onclick}
	>
		<TabIcon class="size-4" />
		<span>{label}</span>
	</Button>
{/snippet}
