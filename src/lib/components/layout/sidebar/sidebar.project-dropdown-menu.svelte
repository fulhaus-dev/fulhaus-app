<script lang="ts">
	import { useProject } from '$lib/client-hooks/use-project.svelte';
	import TextInput from '$lib/components/text-input.svelte';
	import type { LudwigProjectDetails } from '$lib/types';
	import { cn } from '$lib/utils/cn';
	import {
		ChevronDownIcon,
		Icon,
		LayoutGridIcon,
		PencilIcon,
		RssIcon,
		Trash2Icon
	} from '@lucide/svelte';
	import { DropdownMenu } from 'bits-ui';

	type ProjectAction = 'rename' | 'publish' | 'all-projects' | 'archive';

	const {
		class: className = '',
		ludwigProjectDetails
	}: {
		class?: string;
		ludwigProjectDetails: LudwigProjectDetails;
	} = $props();

	const { updateProject } = useProject();

	let renameProject = $state(false);
	let renameProjectInputRef = $state<HTMLInputElement | null>(null);
	let newProjectName = $state(ludwigProjectDetails.name);

	function handleProjectAction(action: ProjectAction) {
		switch (action) {
			case 'rename':
				renameProject = true;

				setTimeout(() => {
					renameProjectInputRef?.focus();
				}, 50);

				break;
			default:
				return;
		}
	}

	function handleUpdateProjectName() {
		renameProject = false;
		updateProject(ludwigProjectDetails._id, { name: newProjectName });
	}
</script>

<TextInput
	bind:ref={renameProjectInputRef}
	class={cn(
		'mt-4 hidden h-[72%] bg-color-background text-sm font-medium',
		renameProject && 'block'
	)}
	bind:value={newProjectName}
	onblur={handleUpdateProjectName}
/>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class={cn(
			'flex w-full cursor-pointer items-center gap-x-2 text-sm font-medium active:opacity-50',
			className,
			renameProject && 'hidden'
		)}
	>
		<h4>
			{ludwigProjectDetails.name}
		</h4>

		<ChevronDownIcon class="size-4" />
	</DropdownMenu.Trigger>

	<DropdownMenu.Portal>
		<DropdownMenu.Content
			class="z-2 min-w-56 rounded-md border border-color-border-muted bg-color-background text-sm shadow-xs shadow-color-shadow-muted"
			align="end"
			sideOffset={8}
		>
			{@render MenuItem({
				class: 'rounded-t-md',
				id: 'rename',
				label: 'Rename',
				MenuIcon: PencilIcon
			})}

			<DropdownMenu.Group class="border-y border-color-border">
				{@render MenuItem({ id: 'publish', label: 'Publish', MenuIcon: RssIcon })}
				{@render MenuItem({ id: 'all-projects', label: 'All Projects', MenuIcon: LayoutGridIcon })}
			</DropdownMenu.Group>

			{@render MenuItem({
				id: 'archive',
				class: 'text-color-error-text hover:bg-color-error-background rounded-b-md',
				label: 'Archive',
				MenuIcon: Trash2Icon
			})}
		</DropdownMenu.Content>
	</DropdownMenu.Portal>
</DropdownMenu.Root>

{#snippet MenuItem({
	id,
	label,
	MenuIcon,
	class: className = ''
}: {
	id: ProjectAction;
	label: string;
	MenuIcon: typeof Icon;
	class?: string;
})}
	<DropdownMenu.Item
		class={cn(
			'flex h-10 w-full cursor-pointer items-center gap-x-2 px-4 text-sm font-medium hover:bg-color-background-surface',
			className
		)}
		onSelect={() => handleProjectAction(id)}
	>
		<MenuIcon class="size-4" />
		<p>{label}</p>
	</DropdownMenu.Item>
{/snippet}
