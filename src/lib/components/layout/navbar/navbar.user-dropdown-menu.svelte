<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { useUserQuery } from '$lib/client/queries/use-user.query.svelte';
	import { useAuthMutation } from '$lib/client/mutations/use-auth.mutation.svelte';
	import Avatar from '$lib/components/avatar.svelte';
	import FulhausLoader from '$lib/components/loaders/fulhaus-loader.svelte';
	import { QueryParams } from '$lib/enums';
	import { CircleUserRoundIcon, Icon, LockKeyholeOpenIcon, LogOutIcon } from '@lucide/svelte';
	import { DropdownMenu } from 'bits-ui';
	import { useCurrentWorkspaceQuery } from '$lib/client/queries/use-workspace.query.svelte';
	import WorkspacePlanViewer from '$lib/components/workspace/workspace-plan-viewer.svelte';

	const userQuery = useUserQuery();
	const userProfile = $derived(userQuery.userProfile);
	const { auth, onLogout } = useAuthMutation();
	const currentWorkspaceQuery = useCurrentWorkspaceQuery();
	const currentWorkspace = $derived(currentWorkspaceQuery.currentWorkspace);

	const isLoggedIn = $derived(!!userProfile._id);

	let open = $state(false);
</script>

{#if auth.loggingOut}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-color-overlay-background">
		<FulhausLoader />
	</div>
{/if}

<DropdownMenu.Root bind:open>
	<DropdownMenu.Trigger class="cursor-pointer active:opacity-50">
		{#if isLoggedIn}
			{@render UserAvatar()}
		{/if}

		{#if !isLoggedIn}
			<CircleUserRoundIcon class="size-5" />
		{/if}
	</DropdownMenu.Trigger>

	<DropdownMenu.Portal>
		<DropdownMenu.Content
			class="z-50 min-w-72 space-y-2 rounded-md border border-color-border-muted bg-color-background text-sm shadow-xs shadow-color-shadow-muted"
			align="end"
			sideOffset={8}
		>
			{#if isLoggedIn}
				<DropdownMenu.Group class="space-y-4 bg-color-background-surface p-4">
					<div class="flex gap-x-2">
						{@render UserAvatar()}
						<div class="flex-1">
							<h5 class="font-semibold">{userProfile?.fullName}</h5>
							<p class="text-xs text-color-text-muted">{userProfile?.email}</p>
						</div>
					</div>

					<div class="space-y-1">
						<p class="text-[10px] font-medium text-color-text-placeholder">Workspace</p>

						<div class="space-y-4 rounded-md border border-color-border p-2 text-xs">
							<div class="flex items-center gap-x-2">
								<Avatar class="size-4" src={currentWorkspace.logoUrl} alt={currentWorkspace.name} />
								<h5>{currentWorkspace.name} Workspace</h5>
							</div>

							<WorkspacePlanViewer label="Credits" onManagePlan={() => (open = false)} />
						</div>
					</div>
				</DropdownMenu.Group>

				<DropdownMenu.Group>
					<!-- {@render MenuItem({ label: 'Workspace Settings', MenuIcon: BriefcaseBusinessIcon })}
					{@render MenuItem({ label: 'Account Settings', MenuIcon: UserRoundCogIcon })} -->
					{@render MenuItem({ label: 'Log Out', MenuIcon: LogOutIcon, onSelect: onLogout })}
				</DropdownMenu.Group>
			{/if}

			{#if !isLoggedIn}
				{@render MenuItem({
					label: 'Log In or Sign Up',
					MenuIcon: LockKeyholeOpenIcon,
					onSelect: () => goto(`/auth?${QueryParams.AUTH_REDIRECT_URL}=${page.url.pathname}`)
				})}
			{/if}
		</DropdownMenu.Content>
	</DropdownMenu.Portal>
</DropdownMenu.Root>

{#snippet UserAvatar()}
	<Avatar
		class="size-6 text-[10px]"
		src={userProfile?.imageUrl}
		alt={userProfile?.fullName}
		fullName={userProfile?.fullName}
	/>
{/snippet}

{#snippet MenuItem({
	label,
	MenuIcon,
	onSelect
}: {
	label: string;
	MenuIcon: typeof Icon;
	onSelect?: () => void;
})}
	<DropdownMenu.Item
		class="flex h-10 w-full cursor-pointer items-center gap-x-2 rounded-md px-4 text-xs hover:bg-color-background-surface"
		{onSelect}
	>
		<MenuIcon class="size-4" />
		<p>{label}</p>
	</DropdownMenu.Item>
{/snippet}
