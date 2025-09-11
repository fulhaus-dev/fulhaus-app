import { Resend, SendEmailOptions } from '@convex-dev/resend';
import { components } from '../_generated/api';
import { MutationCtx } from '../_generated/server';

const resend: Resend = new Resend(components.resend, { testMode: false });

export async function sendEmail(ctx: MutationCtx, emailOptions: SendEmailOptions) {
	return await resend.sendEmail(ctx, emailOptions);
}

const emailService = {
	sendEmail
};

export default emailService;
