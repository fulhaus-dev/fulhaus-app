<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { useAuth } from '$lib/client-hooks/use-auth.svelte';
	import { useUser } from '$lib/client-hooks/use-user.svelte';
	import Avatar from '$lib/components/avatar.svelte';
	import FulhausLoader from '$lib/components/loaders/fulhaus-loader.svelte';
	import { QueryParams } from '$lib/enums';
	import {
		CircleUserRoundIcon,
		Icon,
		LockKeyholeOpenIcon,
		LogOutIcon,
		UserRoundCogIcon
	} from '@lucide/svelte';
	import { DropdownMenu } from 'bits-ui';

	const { user } = useUser();
	const { auth, onLogout } = useAuth();

	const isLoggedIn = $derived(!!user.profile._id);
</script>

{#if auth.loggingOut}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-color-overlay-background">
		<FulhausLoader />
	</div>
{/if}

<DropdownMenu.Root>
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
			class="min-w-52 rounded-md border border-color-border-muted bg-color-background text-sm shadow-xs shadow-color-shadow-muted"
			align="end"
			sideOffset={8}
		>
			{#if isLoggedIn}
				<DropdownMenu.Group class="flex gap-x-2 p-4">
					{@render UserAvatar()}
					<div class="flex-1">
						<h5 class="font-semibold">{user.profile?.fullName}</h5>
						<p class="text-xs text-color-text-muted">{user.profile?.email}</p>
					</div>
				</DropdownMenu.Group>

				{@render MenuItem({ label: 'Account Settings', MenuIcon: UserRoundCogIcon })}
				{@render MenuItem({ label: 'Log Out', MenuIcon: LogOutIcon, onSelect: onLogout })}
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
		src={user.profile?.imageUrl}
		alt={user.profile?.fullName}
		fullName={user.profile?.fullName}
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
		class="flex h-10 w-full cursor-pointer items-center gap-x-2 rounded-md px-4 text-sm hover:bg-color-background-surface"
		{onSelect}
	>
		<MenuIcon class="size-4" />
		<p>{label}</p>
	</DropdownMenu.Item>
{/snippet}
