import { v } from 'convex/values';
import { internalMutation, mutation } from '../../_generated/server';
import { otpEmail } from './email/otp';
import authModel from './model';
import authScheduler from './scheduler';
import emailService from '../../email/service';
import userModel from '../user/model';
import ServerError from '../../response/error';
import { SuccessData, SuccessMessage } from '../../response/success';
import { Id } from '../../_generated/dataModel';

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

		await emailService.sendEmail(ctx, {
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
		otp: v.string()
	},
	handler: async (ctx, { email, otp }) => {
		const actualOtp = await ctx.db
			.query('otps')
			.withIndex('email', (q) => q.eq('email', email.toLowerCase()))
			.first();
		if (!actualOtp) throw ServerError.NotFound('OTP has expired.');
		if (actualOtp.otp !== otp) throw ServerError.BadRequest('Invalid OTP.');

		const user = await userModel.getUserByEmail(ctx, email);
		let userId = user?._id;
		let currentWorkspaceId = user?.currentWorkspaceId as Id<'workspaces'>;

		if (!userId) {
			const newUserData = await userModel.createUser(ctx, email);

			userId = newUserData.userId;
			currentWorkspaceId = newUserData.workspaceId;
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
		await authModel.deleteOtp(ctx, otpId);
	}
});

export const refreshAuthSession = mutation({
	args: {
		sessionId: v.id('sessions')
	},
	handler: async (ctx, { sessionId }) => await authModel.refreshSession(ctx, sessionId)
});

export const logout = mutation({
	args: {
		sessionId: v.id('sessions')
	},
	handler: async (ctx, { sessionId }) => {
		await authModel.deleteSession(ctx, sessionId);

		return SuccessMessage("You've been logged out.");
	}
});
