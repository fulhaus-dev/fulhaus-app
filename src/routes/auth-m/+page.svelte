<!-- <script lang="ts">
	import Button from '$lib/components/button.svelte';
	import ErrorText from '$lib/components/error-text.svelte';
	import TextInput from '$lib/components/text-input.svelte';
	import Link from '$lib/components/link.svelte';
	import FulhausLogoWordmark from '$lib/components/fulhaus-logo-wordmark.svelte';
	import { useAuthMutation } from '$lib/client/mutations/use-auth.mutation.svelte';
	import ImageMasonry from '$lib/components/image-masonry.svelte';
	import { page } from '$app/state';

	const sampleInspoImages = page.data.sampleInspoImages;

	const { auth, onSubmitMigrateOldUser } = useAuthMutation();
</script>

<main class="relative flex h-screen w-screen overflow-y-auto">
	<section class="h-full flex-1 pt-20 lg:max-w-[40%] lg:pt-40">
		<div class="mx-auto w-full space-y-16 px-4 lg:max-w-[24rem] lg:px-0">
			<div class="space-y-4">
				<Link href="/">
					<FulhausLogoWordmark class="h-6 w-auto" />
				</Link>

				<h1 class="text-3xl">
					{#if auth.step === 'email'}
						Migrate Old User
					{/if}
				</h1>
			</div>

			<div class="space-y-4">
				<form class="space-y-8" onsubmit={onSubmitMigrateOldUser}>
					<div class="space-y-4">
						<TextInput
							id="oldUserEmail"
							name="oldUserEmail"
							label="Email"
							placeholder="Enter your email"
							type="email"
							bind:value={auth.oldUserEmail}
						/>

						<TextInput
							id="oldUserFullName"
							name="oldUserFullName"
							label="Full Name"
							placeholder="Enter your full name"
							bind:value={auth.oldUserFullName}
						/>

						<TextInput
							id="oldUserCurrencyCode"
							name="oldUserCurrencyCode"
							label="Currency Code"
							placeholder="USD | CAD"
							bind:value={auth.oldUserCurrencyCode}
						/>

						<TextInput
							id="oldUserCredits"
							name="oldUserCredits"
							label="Credits"
							type="number"
							placeholder="1000"
							bind:value={auth.oldUserCredits}
						/>
					</div>

					<Button
						type="submit"
						disabled={!auth.oldUserEmail || !auth.oldUserFullName || !auth.oldUserCurrencyCode}
						>Submit</Button
					>
				</form>

				{#if !!auth.serverError}
					<ErrorText class="ml-2" error={auth.serverError} />
				{/if}
			</div>
		</div>
	</section>

	<section class="sticky top-0 hidden h-full flex-1 overflow-y-hidden rounded-lg lg:block">
		<ImageMasonry images={sampleInspoImages} />
	</section>
</main> -->
