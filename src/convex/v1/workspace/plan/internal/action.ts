import { v } from 'convex/values';
import { internalAction } from '../../../../_generated/server';
import { internal } from '../../../../_generated/api';
import { vPaymentMetadata } from '../../../payment/validator';
import { UpdateWorkspacePlan } from '../type';
import { planCredits } from '../constant';

export const updatePlan = internalAction({
	args: {
		paymentData: v.any(),
		paymentMetadata: vPaymentMetadata,
		stripeSubscriptionId: v.optional(v.string())
	},
	handler: async (ctx, args) => {
		const workspaceId = args.paymentMetadata.workspaceId;
		if (!workspaceId) return;
		if (args.paymentMetadata.type !== 'credits') return;

		const update: UpdateWorkspacePlan = {
			plan: args.paymentMetadata.plan,
			credit: planCredits[args.paymentMetadata.plan],
			stripeSubscriptionId: args.stripeSubscriptionId
		};

		if (args.paymentMetadata.credit) update.credit = Number(args.paymentMetadata.credit);

		await ctx.runMutation(
			internal.v1.workspace.plan.internal.mutation.updateWorkspacePlanByWorkspaceId,
			{
				workspaceId,
				update
			}
		);
	}
});
