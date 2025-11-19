<script lang="ts">
	import { usePaymentAction } from '$lib/client/actions/use-payment.action.svelte';
	import { useCartMutation } from '$lib/client/mutations/use-cart.mutation.svelte';
	import { useWorkspaceCartQuery } from '$lib/client/queries/use-cart.query.svelte';
	import Button from '$lib/components/button.svelte';
	import Checkbox from '$lib/components/checkbox.svelte';
	import ErrorText from '$lib/components/error-text.svelte';
	import RingLoader from '$lib/components/loaders/ring-loader.svelte';
	import type { CartItem, CartItemQuantityChangeType } from '$lib/types';
	import { cn } from '$lib/utils/cn';
	import number from '$lib/utils/number';
	import { Icon, MinusIcon, MoveLeftIcon, PlusIcon, Trash2Icon } from '@lucide/svelte';
	import type { Id } from '../../../../convex/_generated/dataModel';
	import Link from '$lib/components/link.svelte';
	import { QueryParams } from '$lib/enums';
	import CartSaveForLaterButton from '$lib/components/cart/cart-save-for-later-button.svelte';

	let selectedCartItemIds = $state<Id<'cartItems'>[]>([]);

	const workspaceCartQuery = useWorkspaceCartQuery();
	const { updateCartItems, deleteCartItems } = useCartMutation();
	const { paymentActionState, handleCartCheckout } = usePaymentAction();

	const cartItems = $derived(
		workspaceCartQuery.cartItems.filter((cartItem) => cartItem.savedForLater === 'no')
	);
	const hasCartItems = $derived(cartItems.length > 0);

	const subTotal = $derived.by(() =>
		cartItems
			.map((cartItem) => cartItem.product.retailPrice * (cartItem.quantity ?? 0))
			.reduce((a, b) => a + b, 0)
	);

	const total = $derived(subTotal);

	function onCartQuantityChange(
		cartItemQuantityChangeType: CartItemQuantityChangeType,
		cartItem: CartItem
	) {
		let timeoutId: ReturnType<typeof setTimeout> | undefined = undefined;
		if (timeoutId) clearTimeout(timeoutId);

		timeoutId = setTimeout(() => {
			if (cartItemQuantityChangeType === 'decrement' && cartItem.quantity === 1) return;

			updateCartItems([
				{
					cartItemId: cartItem._id,
					update: {
						quantity:
							cartItemQuantityChangeType === 'increment'
								? cartItem.quantity + 1
								: cartItem.quantity - 1
					}
				}
			]);
		}, 150);
	}
</script>

<section class="relative h-full overflow-y-auto px-4 lg:px-8">
	<div class="mx-auto max-w-[1400px]">
		<div
			class="sticky top-0 z-2 flex h-[6rem] flex-col justify-center space-y-2 bg-color-background"
		>
			<h3>{hasCartItems ? 'Cart' : 'Your Cart is Empty'}</h3>

			<Button class="w-fit text-sm" variant="text" onclick={() => window.history.back()}>
				<MoveLeftIcon />
				Back
			</Button>
		</div>

		{#if hasCartItems}
			<div class="flex w-full gap-x-8 pb-20">
				<div class="flex-1">
					{#each workspaceCartQuery.designs as design, index (design._id)}
						{@render CartItemsList({
							cartItemsData: cartItems.filter((cartItem) => cartItem.designId === design._id),
							design,
							designIndex: index
						})}
					{/each}
				</div>

				<div class="hidden w-[24rem] lg:block">
					<div
						class="sticky top-[9rem] z-1 space-y-8 rounded-md border border-color-border px-4 py-8"
					>
						<h4 class="font-medium">Order Summary</h4>

						<div class="space-y-2">
							{@render OrderSummaryAmount(
								'Subtotal',
								`${number.toMoney(subTotal, workspaceCartQuery.cartCurrencyCode)}`
							)}
							{@render OrderSummaryAmount('Shipping', 'Calculated at checkout', 'info')}
							{@render OrderSummaryAmount('Tax', 'Calculated at checkout', 'info')}

							<div class="h-px bg-color-border-muted"></div>

							{@render OrderSummaryAmount(
								'Total',
								`${number.toMoney(total, workspaceCartQuery.cartCurrencyCode)}`
							)}
						</div>

						<div class="mt-8 space-y-2">
							<div class="space-y-1">
								{@render OrderCheckoutInfo('Shipping', '5-7 business days from multiple suppliers')}
								{@render OrderCheckoutInfo('Returns', '30-day return policy for most items')}
							</div>

							<div class="space-y-1">
								<Button disabled={paymentActionState.loading} onclick={handleCartCheckout}>
									<span>Checkout</span>

									{#if paymentActionState.loading}
										<RingLoader class="fill-color-action-text" />
									{/if}
								</Button>
								{#if paymentActionState.error}
									<ErrorText error={paymentActionState.error} />
								{/if}
							</div>
						</div>

						<Button class="w-fit text-sm" variant="text" onclick={() => window.history.back()}>
							<MoveLeftIcon />
							Continue Shopping
						</Button>
					</div>
				</div>
			</div>
		{/if}
	</div>

	<Button
		class="fixed right-2 bottom-2 left-2 z-10 w-auto lg:hidden"
		disabled={paymentActionState.loading}
		onclick={handleCartCheckout}
	>
		<span>{`Checkout - ${number.toMoney(total, workspaceCartQuery.cartCurrencyCode)}`}</span>

		{#if paymentActionState.loading}
			<RingLoader class="fill-color-action-text" />
		{/if}
	</Button>
</section>

{#if selectedCartItemIds.length > 0}
	<div
		class="fixed right-0 bottom-0 left-0 flex w-screen items-center justify-center bg-color-action-background p-4 text-color-action-text"
	>
		<Button
			class="w-fit border-red-400 text-xs text-red-400 ring-0"
			variant="outlined"
			onclick={() => {
				deleteCartItems(selectedCartItemIds);
				selectedCartItemIds = [];
			}}
		>
			<Trash2Icon class="size-4" />
			<span>{`Remove Selected Item${selectedCartItemIds.length > 1 ? 's' : ''}`}</span>
		</Button>
	</div>
{/if}

{#snippet CartItemsList({
	cartItemsData,
	design,
	designIndex
}: {
	cartItemsData: CartItem[];
	design: { _id: Id<'designs'>; name: string; workspaceId: Id<'workspaces'>; chatId: Id<'chats'> };
	designIndex: number;
})}
	{#if cartItemsData.length > 0}
		<div
			class="sticky top-[6rem] flex h-12 w-full items-end gap-x-4 bg-color-background px-4 pb-4"
			style="z-index: {(designIndex + 1) * 10}"
		>
			<Checkbox
				checked={cartItems
					.filter((cartItem) => cartItem.designId === design._id)
					.every((cartItem) => selectedCartItemIds.includes(cartItem._id))}
				onchange={(e) => {
					if (e.currentTarget.checked) {
						const allDesignCartItemIds = cartItems
							.filter((cartItem) => cartItem.designId === design._id)
							.map((cartItem) => cartItem._id);

						selectedCartItemIds = Array.from(
							new Set([...selectedCartItemIds, ...allDesignCartItemIds])
						);
					} else {
						selectedCartItemIds = selectedCartItemIds.filter(
							(selectedCartItemId) =>
								!cartItems
									.filter((cartItem) => cartItem.designId === design._id)
									.map((cartItem) => cartItem._id)
									.includes(selectedCartItemId)
						);
					}
				}}
			/>

			<Link
				class="group w-fit"
				href={`/${design.workspaceId}/design?${QueryParams.LUDWIG_CHAT_ID}=${design.chatId}`}
			>
				<h5 class="leading-none font-medium uppercase underline-offset-2 group-hover:underline">
					{design.name}
				</h5>
			</Link>
		</div>

		<div
			class="mb-12 h-fit w-full divide-y divide-color-border rounded-md border border-color-border"
		>
			{#each cartItemsData as cartItem (cartItem._id)}
				<div class="flex flex-col justify-between p-4 lg:flex-row">
					<div class="flex gap-x-4">
						<Checkbox
							checked={selectedCartItemIds.includes(cartItem._id)}
							onchange={(e) => {
								if (e.currentTarget.checked)
									selectedCartItemIds = [...selectedCartItemIds, cartItem._id];
								else
									selectedCartItemIds = selectedCartItemIds.filter(
										(selectedCartItemId) => selectedCartItemId !== cartItem._id
									);
							}}
						/>

						<div class="h-36 w-36 rounded-md bg-color-background-surface p-2">
							<img
								class="h-full w-full rounded-md object-contain"
								src={cartItem.product.mainImageUrl}
								alt={cartItem.product.name}
							/>
						</div>

						<div class="flex max-w-96 flex-col justify-between gap-y-4 py-2 text-sm">
							<div class="space-y-2">
								<div class="flex justify-between pb-4 lg:pb-0">
									<p class="text-xs text-color-text-muted">{cartItem.product.category}</p>

									<h4 class="text-xl leading-none font-medium lg:hidden">
										{number.toMoney(
											cartItem.product.retailPrice,
											workspaceCartQuery.cartCurrencyCode
										)}
									</h4>
								</div>

								<h4 class="font-medium">{cartItem.product.name}</h4>
							</div>

							<div class="flex h-10 w-36 items-center rounded-md border border-color-border">
								{@render CartItemQuantityButton(MinusIcon, 'decrement', cartItem)}

								<div
									class="flex h-full flex-1 items-center justify-center border-x border-color-border"
								>
									<p class="text-base">{cartItem.quantity}</p>
								</div>

								{@render CartItemQuantityButton(PlusIcon, 'increment', cartItem)}
							</div>
						</div>
					</div>

					<div class="flex flex-col justify-between py-2">
						<h4 class="hidden text-lg font-medium lg:block">
							{number.toMoney(cartItem.product.retailPrice, workspaceCartQuery.cartCurrencyCode)}
						</h4>

						<div class="mt-8 flex items-center justify-end gap-x-4 lg:mt-0">
							<CartSaveForLaterButton designId={design._id} productId={cartItem.product._id} />

							<Button
								class="text-xs text-color-error-text"
								variant="text"
								onclick={() => deleteCartItems([cartItem._id])}
							>
								<Trash2Icon class="size-4" />
								<span>Remove</span>
							</Button>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
{/snippet}

{#snippet OrderSummaryAmount(label: string | 'Total', amount: string, type?: 'info')}
	<div class="flex items-center justify-between gap-x-8 text-sm">
		<p class={cn(label === 'Total' && 'font-medium')}>{label}</p>
		<h4 class={cn('font-medium', type && 'text-xs font-normal text-color-text-muted')}>{amount}</h4>
	</div>
{/snippet}

{#snippet OrderCheckoutInfo(label: string, info: string)}
	<p class="text-xs text-color-text-muted">
		<span class="font-semibold">{`${label}:`}</span>{` ${info}`}
	</p>
{/snippet}

{#snippet CartItemQuantityButton(
	CartItemQuantityButtonIcon: typeof Icon,
	type: CartItemQuantityChangeType,
	cartItem: CartItem
)}
	<Button class="h-full w-10" variant="text" onclick={() => onCartQuantityChange(type, cartItem)}>
		<CartItemQuantityButtonIcon />
	</Button>
{/snippet}
