<script lang="ts">
	import { useDesignLogQuery } from '$lib/client/queries/use-design-log.query.svelte';
	import IconTooltipButton from '$lib/components/icon-tooltip-button.svelte';
	import Label from '$lib/components/label.svelte';
	import type { DesignLog } from '$lib/types';
	import date from '$lib/utils/date';
	import { DownloadIcon } from '@lucide/svelte';
	import type { Id } from '../../../../convex/_generated/dataModel';
	import { useFileMutation } from '$lib/client/mutations/use-file.mutation.svelte';

	const { designId }: { designId: Id<'designs'> } = $props();

	const designLogQuery = useDesignLogQuery(() => designId);
	const designLogs = $derived(designLogQuery.designLogs);
	const designLogUsers = $derived(designLogQuery.designLogUsers);
	const designLogProducts = $derived(designLogQuery.products);

	const { downloadFileInBrowser } = useFileMutation();
</script>

{#if designLogs.length < 1}
	<div class="text-xs font-medium text-color-text-placeholder">
		<p>No changes yet</p>
	</div>
{/if}

{#if designLogs.length > 0}
	<div class="space-y-8 divide-y divide-color-border">
		{#each designLogs as designLog (designLog._id)}
			<div class="space-y-1">
				<div class="flex items-center justify-between text-[10px] font-medium">
					<p>
						By: {designLogUsers.find((user) => user.userId === designLog.createdById)?.fullName}
					</p>
					<p class="text-color-text-muted">
						{date.formatDateTimeStamp(designLog._creationTime)}
					</p>
				</div>

				<div class="flex border border-color-border text-[10px]">
					<div class="flex-1 border-r border-color-border opacity-60">
						{@render LogHeader('Previous')}
						{@render LogBody(designLog.previous, 'Previous')}
					</div>

					<div class="flex-1 font-medium">
						{@render LogHeader('Current')}
						{@render LogBody(designLog.current, 'Current')}
					</div>
				</div>
			</div>
		{/each}
	</div>
{/if}

{#snippet LogHeader(title: 'Previous' | 'Current')}
	<h5 class="border-b border-color-border bg-color-action-background/5 p-1 text-start leading-none">
		{title}
	</h5>
{/snippet}

{#snippet LogBody(log: DesignLog, prefix: 'Previous' | 'Current')}
	<div class="p-1">
		{#if log.name}
			<div>
				{@render LogBodyLabel(`${prefix} Name:`)}
				<p class="text-xs font-medium">{log.name}</p>
			</div>
		{/if}

		{#if log.description}
			<div>
				{@render LogBodyLabel(`${prefix} Description:`)}
				<p class="text-xs font-medium">{log.description}</p>
			</div>
		{/if}

		{#if log.spaceType}
			<div>
				{@render LogBodyLabel(`${prefix} Space:`)}
				<p class="font-medium">{log.spaceType}</p>
			</div>
		{/if}

		{#if log.spaceType}
			<div>
				{@render LogBodyLabel(`${prefix} Space:`)}
				<p class="font-medium">{log.spaceType}</p>
			</div>
		{/if}

		{#if log.inspirationImageUrl}
			<div>
				{@render LogBodyLabel(`${prefix} Inspiration image:`)}
				<img
					class="h-auto w-full rounded-md object-contain"
					src={log.inspirationImageUrl}
					alt={`${prefix} inspiration image`}
				/>
			</div>
		{/if}

		{#if log.spaceImageUrl}
			<div>
				{@render LogBodyLabel(`${prefix} Inspiration image:`)}
				<img
					class="h-auto w-full rounded-md object-contain"
					src={log.spaceImageUrl}
					alt={`${prefix} inspiration image`}
				/>
			</div>
		{/if}

		{#if log.productIds}
			<div>
				{@render LogBodyLabel(`${prefix} Product${log.productIds.length > 1 ? 's' : ''}:`)}

				<div class="flex flex-wrap gap-2">
					{#each log.productIds as productId, index (`${index}-${productId}`)}
						<img
							class="h-12 w-12 rounded-md object-cover"
							src={designLogProducts.find(
								(designLogProduct) => designLogProduct?._id.toString() === productId.toString()
							)?.mainImageUrl}
							alt={`${prefix} product ${index}`}
						/>
					{/each}
				</div>
			</div>
		{/if}

		{#if log.floorPlanFile}
			<div>
				{@render LogBodyLabel(`${prefix} Floor plan:`)}

				{#if log.floorPlanFile.mediaType.startsWith('image/')}
					<img
						class="h-auto w-full rounded-md object-contain"
						src={log.floorPlanFile.url}
						alt={`${prefix} inspiration image`}
					/>
				{:else}
					{@render DownloadFileUrlButton({
						label: 'Download floor plan',
						fileUrl: log.floorPlanFile.url,
						mediaType: log.floorPlanFile.mediaType,
						fileName: `${prefix.toLowerCase()} floor plan`
					})}
				{/if}
			</div>
		{/if}

		{#if log.productCategories}
			<div>
				{@render LogBodyLabel(
					`${prefix} Product Categor${log.productCategories.length > 1 ? 'ies' : 'y'}:`
				)}

				<div class="flex flex-wrap gap-2">
					{#each log.productIds as productId, index (`${index}-${productId}`)}
						<img
							class="h-12 w-12 rounded-md object-cover"
							src={designLogProducts.find(
								(designLogProduct) => designLogProduct?._id.toString() === productId.toString()
							)?.mainImageUrl}
							alt={`${prefix} product ${index}`}
						/>
					{/each}
				</div>
			</div>
		{/if}

		{#if log.renderedImageUrl}
			<div>
				{@render LogBodyLabel(`${prefix} Rendered image:`)}
				<img
					class="h-auto w-full rounded-md object-contain"
					src={log.renderedImageUrl}
					alt={`${prefix} rendered image`}
				/>
			</div>
		{/if}
	</div>
{/snippet}

{#snippet LogBodyLabel(label: string)}
	<Label class="text-[10px] font-normal">{label}</Label>
{/snippet}

{#snippet DownloadFileUrlButton({
	label,
	fileUrl,
	mediaType = 'image/png',
	fileName = 'download'
}: {
	label: string;
	fileUrl: string;
	mediaType?: string;
	fileName?: string;
})}
	<button
		class="flex cursor-pointer items-center gap-x-2 text-xs text-blue-500 underline underline-offset-4"
		type="button"
		onclick={() => downloadFileInBrowser({ fileUrl, fileName })}
	>
		{#if !mediaType.startsWith('image/')}
			<span>{label}</span>
		{/if}

		<IconTooltipButton content={label}>
			<DownloadIcon class="size-4" />
		</IconTooltipButton>
	</button>
{/snippet}
