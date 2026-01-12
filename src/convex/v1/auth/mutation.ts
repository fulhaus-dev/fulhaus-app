import { v } from 'convex/values';
import { internalMutation, mutation } from '../../_generated/server';
import { otpEmail } from './email/otp';
import authModel from './model';
import authScheduler from './scheduler';
import userModel from '../user/model';
import ServerError from '../../response/error';
import { Id } from '../../_generated/dataModel';
import authorization from '../../middleware/authorization';
import { internal } from '../../_generated/api';
import { SuccessData, SuccessMessage } from '../../response/success';
import { vCurrencyCode } from '../../validator';
import workspacePlanModel from '../workspace/plan/model';

export const sendAuthOtp = mutation({
	args: {
		email: v.string()
	},
	handler: async (ctx, { email }) => {
		const user = await userModel.getUserByEmail(ctx, email);
		const isSignUp = !user;

		const { otp, otpId } = await authModel.createOtp(ctx, email);
		const deleteSchedulerId = await authScheduler.deleteOtpAfter5minutes(ctx, otpId);
		await authModel.updateOtp(ctx, otpId, { deleteSchedulerId });

		const headerText = `Your ${isSignUp ? 'sign up' : 'log in'} code`;

		await ctx.scheduler.runAfter(0, internal.email.internal.action.sendHtmlEmail, {
			from: `Fülhaus <${process.env.AUTH_OTP_SENDER_EMAIL}>`,
			to: email,
			subject: `[Action required] ${headerText}`,
			html: otpEmail({
				previewText: headerText,
				headerText,
				otp: otp
			})
		});

		return SuccessData({ message: 'OTP sent successfully', isSignUp });
	}
});

export const signInWithOtp = mutation({
	args: {
		email: v.string(),
		otp: v.string(),
		currencyCode: vCurrencyCode
	},
	handler: async (ctx, { email, otp, currencyCode }) => {
		const actualOtp = await authModel.getOtpByEmail(ctx, email);
		if (!actualOtp) throw ServerError.NotFound('OTP has expired.');
		if (actualOtp.otp !== otp) throw ServerError.BadRequest('Invalid OTP.');

		const user = await userModel.getUserByEmail(ctx, email);
		let userId = user?._id;
		let currentWorkspaceId = user?.currentWorkspaceId as Id<'workspaces'>;

		if (!userId) {
			const newUserData = await userModel.createUser(ctx, { email, currencyCode });

			userId = newUserData.userId;
			currentWorkspaceId = newUserData.workspaceId;

			await ctx.scheduler.runAfter(0, internal.v1.payment.internal.action.createStripeCustomer, {
				userId,
				currencyCode
			});
		}

		if (actualOtp.deleteSchedulerId) await ctx.scheduler.cancel(actualOtp.deleteSchedulerId);
		await authModel.deleteOtp(ctx, actualOtp._id);

		const { token, sessionId, sessionExpInDays, tokenExpInMinutes } = await authModel.createSession(
			ctx,
			userId
		);

		return SuccessData({
			userId,
			currentWorkspaceId,
			token,
			sessionId,
			sessionExpInDays,
			tokenExpInMinutes
		});
	}
});

export const deleteOtp = internalMutation({
	args: {
		otpId: v.id('otps')
	},
	handler: async (ctx, { otpId }) => {
		return await authModel.deleteOtp(ctx, otpId);
	}
});

export const refreshAuthSession = mutation({
	args: {
		sessionId: v.id('sessions')
	},
	handler: async (ctx, { sessionId }) => {
		const tokenResponse = await authModel.refreshSession(ctx, sessionId);

		return SuccessData(tokenResponse);
	}
});

export const logout = mutation({
	handler: async (ctx) => {
		const userId = await authorization.userIsAuthenticated(ctx);

		const session = await authModel.getSessionByUserId(ctx, userId);
		if (!session) throw ServerError.NotFound('Session not found.');

		await authModel.deleteSession(ctx, session._id);

		return SuccessMessage("You've been logged out.");
	}
});

export const oldUserMigration = mutation({
	args: {
		email: v.string(),
		fullName: v.string(),
		currencyCode: vCurrencyCode,
		credits: v.number()
	},
	handler: async (ctx, { email, fullName, currencyCode, credits }) => {
		const existingUser = await userModel.getUserByEmail(ctx, email);
		if (existingUser)
			return SuccessData({
				userId: existingUser._id
			});

		const newUserData = await userModel.createUser(ctx, { email, currencyCode });

		const newUserId = newUserData.userId;

		const fullNameSplit = fullName.split(' ');

		const firstName = fullNameSplit[0];
		const lastName = fullNameSplit[fullNameSplit.length - 1];

		await Promise.all([
			userModel.updateUserById(ctx, {
				userId: newUserId,
				updates: {
					firstName,
					lastName,
					fullName
				},
				currencyCode
			}),
			workspacePlanModel.updateWorkspacePlanByWorkspaceId(ctx, {
				userId: newUserId,
				workspaceId: newUserData.workspaceId,
				currencyCode,
				update: {
					plan: 'Free',
					credit: credits
				}
			})
		]);

		return SuccessData({
			userId: newUserId
		});
	}
});
