<script lang="ts">
	import { useDesignMutation } from '$lib/client/mutations/use-design.mutation.svelte';
	import { useDesignTagsForWorkspaceQuery } from '$lib/client/queries/use-design.query.svelte';
	import Button from '$lib/components/button.svelte';
	import Checkbox from '$lib/components/checkbox.svelte';
	import TextInput from '$lib/components/text-input.svelte';
	import { PlusIcon } from '@lucide/svelte';
	import { Popover } from 'bits-ui';
	import type { Snippet } from 'svelte';
	import type { Id } from '../../../convex/_generated/dataModel';

	type DesignTagPopoverProps = {
		children: Snippet;
		designId: Id<'designs'>;
		designTags: string[];
	};

	let { children, designId, designTags }: DesignTagPopoverProps = $props();

	let isOpen = $state(false);
	let tagsToAdd = $state<string[]>([]);
	let openNewTagInput = $state(false);
	let newTags = $state<string[]>([]);

	const designTagsForWorkspaceQuery = useDesignTagsForWorkspaceQuery();
	const { addTagsToDesign } = useDesignMutation();

	const nonEmptyNewTags = $derived(newTags.filter((tag) => tag !== ''));
	const canSubmit = $derived(tagsToAdd.length > 0 || nonEmptyNewTags.length > 0);
	const hasTags = $derived(designTagsForWorkspaceQuery.designTags.length > 0 || newTags.length > 0);
</script>

<Popover.Root bind:open={isOpen}>
	<Popover.Trigger>{@render children()}</Popover.Trigger>
	<Popover.Portal>
		<Popover.Content
			class="z-50 w-[20rem] origin-(--bits-popover-content-transform-origin) rounded-md border border-color-border bg-color-background shadow shadow-color-shadow data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
			sideOffset={4}
			align="start"
			collisionPadding={{ top: 8, right: 8, bottom: 8, left: 8 }}
		>
			<div class="space-y-4 p-4">
				{#if openNewTagInput}
					<TextInput
						class="h-8"
						placeholder="Enter new tag"
						bind:value={newTags[newTags.length - 1]}
					/>
				{/if}

				<div class="flex w-full justify-end">
					<Button
						class="gap-x-1 text-xs"
						variant="text"
						onclick={() => {
							newTags = [...newTags, ''];
							openNewTagInput = true;
						}}
					>
						<PlusIcon class="size-4" />
						<span>Add {newTags.length > 0 ? 'Another' : 'New'} Tag</span>
					</Button>
				</div>
			</div>

			{#if nonEmptyNewTags.length > 0}
				<div class="space-y-2 overflow-y-auto px-4 pt-2">
					{#each newTags.filter((tag) => tag !== '') as newTag, index (`${index}-${newTag}`)}
						{@render DesignTagCheckbox({
							id: `${index}-${newTag}`,
							label: newTag,
							checked: newTags.includes(newTag),
							onchange: (checked: boolean) => {
								if (!checked) newTags = newTags.filter((tag) => tag !== newTag);
							}
						})}
					{/each}
				</div>
			{/if}

			{#if hasTags}
				<div
					class="scrollbar-thin max-h-[24rem] space-y-2 overflow-y-auto border-b border-color-border px-4 py-2"
				>
					{#each designTagsForWorkspaceQuery.designTags.filter((tag) => !designTags.includes(tag)) as designTag, index (`${index}-${designTag}`)}
						{@render DesignTagCheckbox({
							id: `${index}-${designTag}`,
							label: designTag,
							checked: tagsToAdd.includes(designTag),
							onchange: (checked: boolean) => {
								if (checked) {
									tagsToAdd = [...tagsToAdd, designTag];
								} else {
									tagsToAdd = tagsToAdd.filter((tag) => tag !== designTag);
								}
							}
						})}
					{/each}
				</div>
			{/if}

			{#if canSubmit}
				<div class="border-t border-color-border p-4">
					<Button
						class="h-10"
						onclick={() => {
							addTagsToDesign(designId, [...tagsToAdd, ...nonEmptyNewTags]);
							isOpen = false;
							newTags = [];
							tagsToAdd = [];
						}}
					>
						Add {tagsToAdd.length + nonEmptyNewTags.length}
						{tagsToAdd.length + nonEmptyNewTags.length < 2 ? 'tag' : 'tags'}
					</Button>
				</div>
			{/if}
		</Popover.Content>
	</Popover.Portal>
</Popover.Root>

{#snippet DesignTagCheckbox({
	id,
	label,
	checked,
	onchange
}: {
	id: string;
	label: string;
	checked: boolean;
	onchange: (checked: boolean) => void;
})}
	<div class="flex items-center gap-x-2">
		<Checkbox
			{id}
			{checked}
			onchange={(event) => {
				const checked = event.currentTarget.checked;

				onchange(checked);
			}}
		/>
		<label for={id} class="text-sm">{label}</label>
	</div>
{/snippet}
