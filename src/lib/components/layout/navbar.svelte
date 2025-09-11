<script lang="ts">
	import { page } from '$app/state';
	import Avatar from '$lib/components/avatar.svelte';
	import FulhausLogoWordmark from '$lib/components/fulhaus-logo-wordmark.svelte';
	import Link from '$lib/components/link.svelte';
	import { cn } from '$lib/utils/cn';
	import { CircleQuestionMarkIcon, ShoppingCartIcon, Icon } from '@lucide/svelte';

	const { class: className = '' }: { class?: string } = $props();

	const workspaceId = page.data.activeWorkspaceId;
</script>

<nav class={cn('flex h-[2.4rem] items-center justify-between px-4', className)}>
	<div class="content flex-1">
		<Link href="/">
			<FulhausLogoWordmark />
		</Link>
	</div>

	<menu class="flex flex-1 items-center justify-center gap-x-8">
		<Link href={`/${workspaceId}/ludwig`}>Ludwig</Link>
		<Link href="/shop-designs">Shop Designs</Link>
		<Link href="/inspiration">Inspiration</Link>
	</menu>

	<menu class="flex flex-1 items-center justify-end gap-x-6">
		<Link class="relative" href="/">
			<p
				class="bg-color-button-bg text-color-button-text absolute -top-1 -right-2 flex items-center justify-center rounded-full p-0.5 text-[8px] leading-none font-bold"
			>
				{'0'}
			</p>
			{@render NavbarIcon(ShoppingCartIcon)}
		</Link>
		<Link href="/#">
			{@render NavbarIcon(CircleQuestionMarkIcon)}
		</Link>
		<Link href="/#">
			<Avatar />
		</Link>
	</menu>
</nav>

{#snippet NavbarIcon(NavbarIcon: typeof Icon)}
	<NavbarIcon class="size-4" />
{/snippet}
