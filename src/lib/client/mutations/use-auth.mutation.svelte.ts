/* eslint-disable svelte/no-navigation-without-resolve */
import { api } from '../../../convex/_generated/api.js';
import { asyncTryCatch } from '$lib/utils/try-catch.js';
import error from '$lib/utils/error.js';
import z from 'zod';
import asyncFetch from '$lib/utils/async-fetch.js';
import { goto } from '$app/navigation';
import type { Id } from '../../../convex/_generated/dataModel.js';
import { page } from '$app/state';
import { QueryParams } from '$lib/enums.js';
import { useConvexClient } from '$lib/client/convex/use-convex-client.svelte.js';
import { useRouteMutation } from '$lib/client/mutations/use-route.mutation.svelte.js';
import { onMount } from 'svelte';

type AuthStep = 'email' | 'otp' | 'name';

const OTP_LENGTH = 6;

export function useAuthMutation() {
	const convexClient = useConvexClient();
	const { updateRouteQuery } = useRouteMutation();

	const redirectUrl = page.url.searchParams.get(QueryParams.AUTH_REDIRECT_URL) ?? '/';
	const authStep = (page.url.searchParams.get(QueryParams.AUTH_STEP) ?? 'email') as AuthStep;

	const state = $state({
		isSignUp: false,
		step: authStep,
		email: undefined as string | undefined,
		otp: undefined as string | undefined,
		firstName: undefined as string | undefined,
		lastName: undefined as string | undefined,
		phone: undefined as string | undefined,
		userId: undefined as Id<'users'> | undefined,
		loading: false,
		loggingOut: false,
		resentVerificationCode: false,
		verificationCodeExpiresAt: 45000,
		verificationCodeElapsedTime: 45000,
		serverError: undefined as string | undefined
	});

	onMount(() => {
		let currentTime = performance.now();

		let frame = requestAnimationFrame(function update(time) {
			frame = requestAnimationFrame(update);

			state.verificationCodeElapsedTime += Math.min(
				time - currentTime,
				state.verificationCodeExpiresAt - state.verificationCodeElapsedTime
			);
			currentTime = time;
		});

		return () => {
			cancelAnimationFrame(frame);
		};
	});

	function getInputErrors() {
		return {
			emailError: error.zodErrorMessage(z.email('A valid email is required'), state.email),
			otpError: error.zodErrorMessage(
				z
					.string(`Invalid ${state.isSignUp ? 'sign up' : 'log in'} code`)
					.length(OTP_LENGTH, 'Incomplete verification code'),
				`${state.otp}`
			),
			firstNameError: error.zodErrorMessage(
				z.string('Your first name is required').min(2, 'A valid first name is required'),
				state.firstName
			),
			lastNameError: error.zodErrorMessage(
				z.string('Your last name is required').min(2, 'A valid last name is required'),
				state.lastName
			)
		};
	}

	async function onSubmitSendVerificationCode(
		event: SubmitEvent & {
			currentTarget: EventTarget & HTMLFormElement;
		}
	) {
		event.preventDefault();
		sendVerificationCode();
	}

	async function resendVerificationCode() {
		await sendVerificationCode();
		state.resentVerificationCode = true;
	}

	async function sendVerificationCode() {
		state.serverError = undefined;

		if (!state.email) {
			state.serverError = 'An email is required';
			return;
		}

		state.loading = true;
		const userEmail = state.email;

		const { data: response, error } = await asyncTryCatch(() =>
			convexClient.mutation(api.v1.auth.mutation.sendAuthOtp, {
				email: userEmail
			})
		);

		state.loading = false;
		state.verificationCodeElapsedTime = 0;

		if (error) {
			state.serverError = error.message;
			return;
		}

		state.isSignUp = response.isSignUp;
		state.step = 'otp';
		updateRouteQuery({ queryString: `${QueryParams.AUTH_STEP}=otp` });
	}

	async function onSubmitSignInWithOtp(
		event: SubmitEvent & {
			currentTarget: EventTarget & HTMLFormElement;
		}
	) {
		event.preventDefault();
		state.serverError = undefined;

		if (!state.email) {
			state.serverError = 'An email is required';
			return;
		}

		if (!state.otp) {
			state.serverError = `A ${state.isSignUp ? 'sign up' : 'log in'} code is required`;
			return;
		}

		state.loading = true;

		const userEmail = state.email;
		const otpValue = state.otp;

		const { data: response, error } = await asyncTryCatch(() =>
			convexClient.mutation(api.v1.auth.mutation.signInWithOtp, {
				email: userEmail,
				otp: otpValue
			})
		);
		if (error) {
			state.serverError = error.message;
			state.loading = false;
			return;
		}

		const { error: setCookieError } = await asyncFetch.post('/api/auth/cookies/set', {
			body: JSON.stringify(response),
			headers: { 'Content-Type': 'application/json' }
		});

		if (setCookieError) {
			state.serverError = setCookieError.message;
			state.loading = false;
			return;
		}

		if (state.isSignUp) {
			state.userId = response.userId;
			state.step = 'name';
			state.loading = false;
			updateRouteQuery({ queryString: `${QueryParams.AUTH_STEP}=name` });

			setTimeout(() => {
				window.location.reload();
			}, 100);
			return;
		}

		await redirectAfterAuth(redirectUrl);
	}

	async function onSubmitNewUserProfile(
		event: SubmitEvent & {
			currentTarget: EventTarget & HTMLFormElement;
		}
	) {
		event.preventDefault();
		state.serverError = undefined;

		if (!state.firstName || !state.lastName) {
			state.serverError = 'Your fullname is required';
			return;
		}

		state.loading = true;

		const { error } = await asyncTryCatch(() =>
			convexClient.mutation(api.v1.user.mutation.updateUserById, {
				updates: {
					firstName: state.firstName,
					lastName: state.lastName,
					fullName: `${state.firstName} ${state.lastName}`,
					phone: state.phone
				}
			})
		);
		if (error) {
			state.serverError = error.message;
			state.loading = false;
			return;
		}

		await redirectAfterAuth(redirectUrl);
	}

	async function onLogout() {
		state.loggingOut = true;

		await Promise.all([
			asyncFetch.post('/api/auth/cookies/clear', {
				headers: { 'Content-Type': 'application/json' }
			}),
			asyncTryCatch(() => convexClient.mutation(api.v1.auth.mutation.logout, {}))
		]);

		await redirectAfterAuth('/auth');
	}

	async function redirectAfterAuth(url: string) {
		await goto(url);
		window.location.reload();
	}

	return {
		auth: state,
		getInputErrors,
		onSubmitSendVerificationCode,
		resendVerificationCode,
		onSubmitSignInWithOtp,
		onSubmitNewUserProfile,
		onLogout
	};
}
