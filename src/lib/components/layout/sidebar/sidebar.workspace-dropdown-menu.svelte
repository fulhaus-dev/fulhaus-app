<script lang="ts">
	import { useUserWorkspacesQuery } from '$lib/client/queries/use-workspace.query.svelte';
	import Avatar from '$lib/components/avatar.svelte';
	import type { Workspace } from '$lib/types';
	import { cn } from '$lib/utils/cn';
	import {
		ChevronDownIcon,
		ChevronRightIcon,
		CirclePlusIcon,
		Rotate3dIcon,
		SettingsIcon
	} from '@lucide/svelte';
	import { DropdownMenu } from 'bits-ui';

	const {
		class: className = '',
		currentWorkspace
	}: {
		class?: string;
		currentWorkspace: Workspace;
	} = $props();

	const userWorkspacesQuery = useUserWorkspacesQuery();

	const userNonCurrentWorkspaces = $derived(
		userWorkspacesQuery.userWorkspaces.filter(
			(userWorkspace) => userWorkspace._id !== currentWorkspace._id
		)
	);
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class={cn(
			'flex w-full cursor-pointer items-center gap-x-2 text-sm font-medium active:opacity-50',
			className
		)}
	>
		<Avatar class="size-4" src={currentWorkspace.logoUrl} alt={currentWorkspace.name} />
		<h4>
			{currentWorkspace.name} Workspace
		</h4>

		<ChevronDownIcon class="size-4" />
	</DropdownMenu.Trigger>

	<DropdownMenu.Portal>
		<DropdownMenu.Content
			class="z-50 w-80 rounded-md border border-color-border-muted bg-color-background-surface text-sm shadow-xs shadow-color-shadow-muted"
			align="start"
			sideOffset={8}
		>
			<div class="flex flex-col items-center justify-center gap-y-2 px-4 py-8">
				<Avatar class="size-12" src={currentWorkspace.logoUrl} alt={currentWorkspace.name} />
				<h4 class="text-sm font-medium">
					{currentWorkspace.name} Workspace
				</h4>

				<div class="w-full py-4">
					<DropdownMenu.Item
						class="flex h-10 w-full cursor-pointer items-center justify-center gap-x-2 rounded-full border border-color-border bg-color-background px-4 text-sm font-medium"
					>
						<SettingsIcon class="size-4" />
						<p>Manage Workspace</p>
					</DropdownMenu.Item>
				</div>
			</div>

			<DropdownMenu.Group class="rounded-b-md border-y border-color-border bg-color-background">
				<DropdownMenu.Item
					class="flex h-12 w-full cursor-pointer items-center gap-x-2 px-4 text-sm font-medium hover:bg-color-background-surface"
				>
					<CirclePlusIcon class="size-6" />
					<p>Add another workspace</p>
				</DropdownMenu.Item>

				{#if userNonCurrentWorkspaces.length > 0}
					{@render WorkspacesSubMenu()}
				{/if}
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Portal>
</DropdownMenu.Root>

{#snippet WorkspacesSubMenu()}
	<DropdownMenu.Sub>
		<DropdownMenu.SubTrigger
			class="flex h-12 w-full cursor-pointer items-center justify-between gap-x-2 px-4 text-sm font-medium hover:bg-color-background-surface"
		>
			<div class="flex items-center gap-x-2">
				<Rotate3dIcon class="size-4" />
				<p>Switch Workspace</p>
			</div>

			<ChevronRightIcon />
		</DropdownMenu.SubTrigger>

		<DropdownMenu.Portal>
			<DropdownMenu.SubContent
				class="z-50 w-80 rounded-md border border-color-border bg-color-background px-1 py-1.5 ring-0! ring-transparent! outline-none"
				sideOffset={8}
			>
				{#each userNonCurrentWorkspaces as userWorkspace (userWorkspace._id)}
					<DropdownMenu.Item
						class="flex h-10 w-full cursor-pointer items-center gap-x-2 rounded-md px-4 text-sm hover:bg-color-background-surface"
					>
						<Avatar class="size-4" src={userWorkspace.logoUrl} alt={userWorkspace.name} />
						<p>{userWorkspace.name}</p>
					</DropdownMenu.Item>
				{/each}
			</DropdownMenu.SubContent>
		</DropdownMenu.Portal>
	</DropdownMenu.Sub>
{/snippet}
