<script lang="ts">
	import Button from '$lib/components/button.svelte';
	import ErrorText from '$lib/components/error-text.svelte';
	import PinInput from '$lib/components/pin-input.svelte';
	import TextInput from '$lib/components/text-input.svelte';
	import Link from '$lib/components/link.svelte';
	import FulhausLogoWordmark from '$lib/components/fulhaus-logo-wordmark.svelte';
	import { useAuthMutation } from '$lib/client/mutations/use-auth.mutation.svelte';
	import ImageMasonry from '$lib/components/image-masonry.svelte';
	import { page } from '$app/state';
	import { cn } from '$lib/utils/cn';
	import CircularProgressBar from '$lib/components/circular-progress-bar.svelte';
	import Checkbox from '$lib/components/checkbox.svelte';
	import TextArea from '$lib/components/text-area.svelte';

	const whatBroughtYouHereOptions = [
		'Interior Designer',
		'Furnishing my home',
		'Furnishing business or rental property',
		'Retailer',
		'Manufacturer',
		'Design Enthusiast',
		'Other'
	];

	const howDidYouFindUsOptions = [
		'Google search',
		'Social Media',
		'Referral',
		'Email',
		'Event',
		'Other'
	];

	const sampleInspoImages = page.data.sampleInspoImages;

	const {
		auth,
		getInputErrors,
		onSubmitSendVerificationCode,
		resendVerificationCode,
		onSubmitSignInWithOtp,
		onSubmitNewUserProfile,
		onSubmitHowDidYouFindUs,
		onSubmitWhatBroughtYouHere
	} = useAuthMutation();

	const { emailError, otpError, firstNameError, lastNameError } = $derived(getInputErrors());
	const disableResendVerificationCode = $derived(
		auth.resentVerificationCode ||
			!(auth.verificationCodeExpiresAt === auth.verificationCodeElapsedTime)
	);
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

							<div class="flex items-center justify-end pr-2">
								<Button
									class={cn(
										'text-xs underline-offset-2 hover:underline',
										disableResendVerificationCode && 'hover:no-underline'
									)}
									variant="text"
									disabled={disableResendVerificationCode}
									onclick={resendVerificationCode}
								>
									{#if disableResendVerificationCode && !auth.resentVerificationCode}
										<CircularProgressBar
											class="size-4 stroke-8"
											progressPercentage={Number(
												(
													(auth.verificationCodeElapsedTime / auth.verificationCodeExpiresAt) *
													100
												).toFixed(1)
											)}
										/>
									{/if}

									{#if auth.resentVerificationCode}
										Verification code resent
									{:else}
										Resend Verification Code
									{/if}
								</Button>
							</div>
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

				{#if auth.step === 'reason'}
					<form class="space-y-8 pb-96" onsubmit={onSubmitWhatBroughtYouHere}>
						<div class="space-y-8">
							<div>
								<h1 class="text-3xl">What brought you here?</h1>
								<p class="text-color-text-muted">Select all that apply</p>
							</div>

							<div class="space-y-4">
								{#each whatBroughtYouHereOptions as whatBroughtYouHereOption (whatBroughtYouHereOption)}
									{@render OnboardingQuestion({
										id: whatBroughtYouHereOption,
										label: whatBroughtYouHereOption,
										checked: auth.whatBroughtYouHere === whatBroughtYouHereOption,
										onchange: (checked) => {
											if (checked) auth.whatBroughtYouHere = whatBroughtYouHereOption;
											if (!checked) auth.whatBroughtYouHere = undefined;
										}
									})}
								{/each}

								{#if auth.whatBroughtYouHere === 'Other'}
									<TextArea
										id="whatBroughtYouHere"
										class="bg-transparent"
										name="whatBroughtYouHere"
										placeholder="You're Unique! Tell us more"
										bind:value={auth.whatBroughtYouHereOther}
									/>
								{/if}
							</div>
						</div>

						<Button
							type="submit"
							disabled={!auth.whatBroughtYouHereOther &&
								(!auth.whatBroughtYouHere || auth.whatBroughtYouHere === 'Other')}
						>
							Submit
						</Button>
					</form>
				{/if}

				{#if auth.step === 'find'}
					<form class="space-y-8 pb-96" onsubmit={onSubmitHowDidYouFindUs}>
						<div class="space-y-8">
							<div>
								<h1 class="text-3xl">How did you find us</h1>
								<p class="text-color-text-muted">Select all that apply</p>
							</div>

							<div class="space-y-4">
								{#each howDidYouFindUsOptions as howDidYouFindUsOption (howDidYouFindUsOption)}
									{@render OnboardingQuestion({
										id: howDidYouFindUsOption,
										label: howDidYouFindUsOption,
										checked: auth.howDidYouFindUs === howDidYouFindUsOption,
										onchange: (checked) => {
											if (checked) auth.howDidYouFindUs = howDidYouFindUsOption;
											if (!checked) auth.howDidYouFindUs = undefined;
										}
									})}
								{/each}

								{#if auth.howDidYouFindUs === 'Other'}
									<TextArea
										id="howDidYouFindUs"
										class="bg-transparent"
										name="howDidYouFindUs"
										label="Other"
										placeholder="How did you hear about us"
										bind:value={auth.howDidYouFindUsOther}
									/>
								{/if}
							</div>
						</div>

						<Button
							type="submit"
							disabled={!auth.howDidYouFindUsOther &&
								(!auth.howDidYouFindUs || auth.howDidYouFindUs === 'Other')}
						>
							Submit
						</Button>
					</form>
				{/if}

				{#if !!auth.serverError}
					<ErrorText class="ml-2" error={auth.serverError} />
				{/if}
			</div>
		</div>
	</section>

	<section class="sticky top-0 hidden h-full flex-1 overflow-y-hidden rounded-lg lg:block">
		<ImageMasonry images={sampleInspoImages} />
	</section>
</main>

{#snippet OnboardingQuestion({
	id,
	label,
	checked,
	onchange
}: {
	id: string;
	label: string;
	checked: boolean;
	onchange: (checked: boolean) => void;
})}
	<div class="flex items-center gap-x-2">
		<Checkbox
			{id}
			{checked}
			onchange={(event) => {
				const checked = event.currentTarget.checked;

				onchange(checked);
			}}
		/>
		<label for={id} class="text-lg">{label}</label>
	</div>
{/snippet}
