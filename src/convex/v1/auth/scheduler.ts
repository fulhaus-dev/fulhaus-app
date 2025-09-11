import { MutationCtx } from '../../_generated/server';
import { Id } from '../../_generated/dataModel';
import { internal } from '../../_generated/api';

export async function deleteOtpAfter5minutes(ctx: MutationCtx, otpId: Id<'otps'>) {
	const FIVE_MINUTES_IN_MS = 5 * 60 * 1000;
	return await ctx.scheduler.runAfter(FIVE_MINUTES_IN_MS, internal.v1.auth.mutation.deleteOtp, {
		otpId
	});
}

const authScheduler = {
	deleteOtpAfter5minutes
};

export default authScheduler;
