<script lang="ts">
	import { page } from '$app/state';
	import FulhausLogoWordmark from '$lib/components/fulhaus-logo-wordmark.svelte';
	import CartPreviewIcon from '$lib/components/cart/cart-preview-icon.svelte';
	import NavbarUserDropdownMenu from '$lib/components/layout/navbar/navbar.user-dropdown-menu.svelte';
	import Link from '$lib/components/link.svelte';
	import { cn } from '$lib/utils/cn';
	import NavbarWorkspacePlan from '$lib/components/layout/navbar/navbar.workspace-plan-dropdown.svelte';
	import NavbarCurrencyDropdownMenu from '$lib/components/layout/navbar/navbar.currency-dropdown-menu.svelte';

	const { class: className = '' }: { class?: string } = $props();

	const workspaceId = page.data.activeWorkspaceId;
</script>

<nav class={cn('flex h-[2.8rem] items-center justify-between px-4', className)}>
	<div class="content flex-1">
		<Link href="/">
			<FulhausLogoWordmark />
		</Link>
	</div>

	<!-- <menu class="flex flex-1 items-center justify-center gap-x-8">
		<Link href={`/${workspaceId}/ludwig`}>Ludwig</Link>
		<Link href="/shop-designs">Shop Designs</Link>
		<Link href="/inspiration">Inspiration</Link>
	</menu> -->

	<menu class="flex flex-1 items-center justify-end gap-x-6">
		<div class="flex items-center gap-x-2">
			<NavbarCurrencyDropdownMenu />

			<Link href={`/${workspaceId}/cart`}>
				<CartPreviewIcon />
			</Link>
		</div>
		<!-- <Link href="/#">
			{@render NavbarIcon(CircleQuestionMarkIcon)}
		</Link> -->
		<div class="flex items-center gap-x-2">
			<NavbarWorkspacePlan />
			<NavbarUserDropdownMenu />
		</div>
	</menu>
</nav>
<!-- 
{#snippet NavbarIcon(NavbarIcon: typeof Icon)}
	<NavbarIcon class="size-4" />
{/snippet} -->
