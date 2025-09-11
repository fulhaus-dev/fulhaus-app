<script lang="ts">
	import Button from '$lib/components/button.svelte';
	import ErrorText from '$lib/components/error-text.svelte';
	import PinInput from '$lib/components/pin-input.svelte';
	import TextInput from '$lib/components/text-input.svelte';
	import { useAuth } from '$lib/client-hooks/use-auth.svelte';
	import Link from '$lib/components/link.svelte';
	import FulhausLogoWordmark from '$lib/components/fulhaus-logo-wordmark.svelte';

	const {
		auth,
		getInputErrors,
		onSubmitSendVerificationCode,
		onSubmitSignInWithOtp,
		onSubmitNewUserProfile
	} = useAuth();

	const { emailError, otpError, firstNameError, lastNameError } = $derived(getInputErrors());
</script>

<section class="mx-auto h-screen w-full max-w-96 space-y-16 pt-40">
	<div class="space-y-4">
		<Link href="/">
			<FulhausLogoWordmark class="h-8 w-auto" />
		</Link>

		<h1 class="text-3xl font-medium">
			{#if auth.step === 'email'}
				Log in or Sign Up
			{/if}

			{#if auth.step === 'otp'}
				{`${auth.isSignUp ? 'Sign Up' : 'Log In'} Code`}
			{/if}

			{#if auth.step === 'name'}
				Complete Your Profile
			{/if}
		</h1>
	</div>

	<div class="space-y-4">
		{#if auth.step === 'email'}
			<form class="space-y-8" onsubmit={onSubmitSendVerificationCode}>
				<TextInput
					id="email"
					name="email"
					label="Email"
					placeholder="Enter your email"
					type="email"
					error={emailError}
					bind:value={auth.email}
				/>

				<Button type="submit" disabled={!auth.email || !!emailError} loading={auth.loading}
					>Get Verification Code</Button
				>
			</form>
		{/if}

		{#if auth.step === 'otp'}
			<form class="space-y-12" onsubmit={onSubmitSignInWithOtp}>
				<div class="space-y-4">
					<div>
						<h4>
							{`Enter the ${auth.isSignUp ? 'sign up' : 'log in'} code we sent to your email`}
						</h4>
						<p class="text-xs text-color-text-muted">{auth.email}</p>
					</div>

					<PinInput id="otp" name="otp" bind:pin={auth.otp} error={otpError} />
				</div>

				<Button type="submit" disabled={!auth.otp || !!otpError} loading={auth.loading}
					>{auth.isSignUp ? 'Sign Up' : 'Log In'}</Button
				>
			</form>
		{/if}

		{#if auth.step === 'name'}
			<form class="space-y-8" onsubmit={onSubmitNewUserProfile}>
				<div class="space-y-4">
					<TextInput
						id="firstName"
						name="firstName"
						label="First Name"
						placeholder="Enter your first name"
						error={firstNameError}
						bind:value={auth.firstName}
					/>

					<TextInput
						id="lastName"
						name="lastName"
						label="Last Name"
						placeholder="Enter your last name"
						error={lastNameError}
						bind:value={auth.lastName}
					/>

					<TextInput
						id="phoneNumber"
						name="phoneNumber"
						label="Phone Number"
						placeholder="Enter phone number"
						type="tel"
						bind:value={auth.phone}
						optional
					/>
				</div>

				<Button
					type="submit"
					disabled={!auth.firstName || !auth.lastName || !!firstNameError || !!lastNameError}
					>Submit</Button
				>
			</form>
		{/if}

		{#if !!auth.serverError}
			<ErrorText class="ml-2" error={auth.serverError} />
		{/if}
	</div>
</section>
