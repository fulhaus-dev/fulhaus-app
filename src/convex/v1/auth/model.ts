import { MutationCtx, QueryCtx } from '../../_generated/server';
import { Id } from '../../_generated/dataModel';
import date from '../../util/date';
import ServerError from '../../response/error';
import { authJwtManager } from '../../auth.config';
import generator from '../../util/generator';

async function createOtp(ctx: MutationCtx, email: string) {
	const otp = generator.otp();

	const otpId = await ctx.db.insert('otps', {
		email: email.toLowerCase(),
		otp
	});

	return { otp, otpId };
}

export async function updateOtp(
	ctx: MutationCtx,
	otpId: Id<'otps'>,
	data: { deleteSchedulerId: Id<'_scheduled_functions'> }
) {
	return await ctx.db.patch(otpId, data);
}

async function deleteOtp(ctx: MutationCtx, otpId: Id<'otps'>) {
	await ctx.db.delete(otpId);
}

async function createSession(ctx: MutationCtx, userId: Id<'users'>) {
	const session = await getSessionByUserId(ctx, userId);
	let sessionId = session?._id;

	const sessionExpInDays = Number(process.env.AUTH_SESSION_EXP_IN_DAYS ?? '30');

	if (!sessionId) {
		sessionId = await ctx.db.insert('sessions', {
			userId,
			createdAt: date.now(),
			expInDays: sessionExpInDays
		});
	}

	const { token, tokenExpInMinutes } = await authJwtManager.generateToken(userId);

	return { sessionId, sessionExpInDays, token, tokenExpInMinutes };
}

async function getSessionById(ctx: QueryCtx, sessionId: Id<'sessions'>) {
	const session = await ctx.db.get(sessionId);
	if (!session) return null;

	const createdDate = new Date(session.createdAt);

	const expirationDate = new Date(createdDate);
	expirationDate.setDate(createdDate.getDate() + session.expInDays);

	const currentDate = new Date();

	if (currentDate > expirationDate) return null;

	return session;
}

async function getSessionByUserId(ctx: QueryCtx, userId: Id<'users'>) {
	const session = await ctx.db
		.query('sessions')
		.withIndex('user_id', (q) => q.eq('userId', userId))
		.first();

	if (!session) return null;

	return await getSessionById(ctx, session._id);
}

async function refreshSession(ctx: MutationCtx, sessionId: Id<'sessions'>) {
	const session = await getSessionById(ctx, sessionId);
	if (!session) {
		await deleteSession(ctx, sessionId);

		throw ServerError.Unauthorized('Invalid session.');
	}

	const { token, tokenExpInMinutes } = await authJwtManager.generateToken(session.userId);

	return { token, tokenExpInMinutes };
}

async function deleteSession(ctx: MutationCtx, sessionId: Id<'sessions'>) {
	await ctx.db.delete(sessionId);
}

const authModel = {
	createOtp,
	updateOtp,
	deleteOtp,
	createSession,
	getSessionById,
	getSessionByUserId,
	refreshSession,
	deleteSession
};
export default authModel;
