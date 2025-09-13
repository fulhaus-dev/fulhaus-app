import { v } from 'convex/values';
import { internalAction } from '../../_generated/server';
import resend from '../../config/resend';

export const sendEmail = internalAction({
	args: {
		from: v.string(),
		to: v.string(),
		subject: v.string(),
		html: v.string()
	},
	handler: async (_, args) => await resend.emails.send(args)
});
