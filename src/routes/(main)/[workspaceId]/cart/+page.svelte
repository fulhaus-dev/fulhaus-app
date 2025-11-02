<script lang="ts">
	import { usePaymentAction } from '$lib/client/actions/use-payment.action.svelte';
	import { useCartMutation } from '$lib/client/mutations/use-cart.mutation.svelte';
	import { useWorkspaceCartQuery } from '$lib/client/queries/use-cart.query.svelte';
	import Button from '$lib/components/button.svelte';
	import ErrorText from '$lib/components/error-text.svelte';
	import RingLoader from '$lib/components/loaders/ring-loader.svelte';
	import type { CartItem, CartItemQuantityChangeType } from '$lib/types';
	import { cn } from '$lib/utils/cn';
	import number from '$lib/utils/number';
	import { Icon, MinusIcon, MoveLeftIcon, PlusIcon, Trash2Icon } from '@lucide/svelte';

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

<section class="relative h-full overflow-y-auto px-8">
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
			<div class="flex gap-x-8 pb-20">
				<div
					class="h-fit flex-1 divide-y divide-color-border rounded-md border border-color-border"
				>
					{#each cartItems as cartItem (cartItem._id)}
						<div class="flex justify-between p-4">
							<div class="flex gap-x-4">
								<div class="h-36 w-36 rounded-md bg-color-background-surface p-2">
									<img
										class="h-full w-full rounded-md object-contain"
										src={cartItem.product.mainImageUrl}
										alt={cartItem.product.name}
									/>
								</div>

								<div class="flex max-w-96 flex-col justify-between gap-y-4 py-2 text-sm">
									<div class="space-y-2">
										<p class="text-xs text-color-text-muted">{cartItem.product.category}</p>
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
								<h4 class="text-lg font-medium">
									{number.toMoney(
										cartItem.product.retailPrice,
										workspaceCartQuery.cartCurrencyCode
									)}
								</h4>

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
					{/each}
				</div>

				<div class="w-[24rem]">
					<div
						class="sticky top-[6rem] z-1 space-y-8 rounded-md border border-color-border px-4 py-8"
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
</section>

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
