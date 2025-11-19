import { v } from 'convex/values';
import { internalAction } from '../../../_generated/server';
import paymentModel from '../model';

export const cancelSubscription = internalAction({
	args: {
		subscriptionId: v.string()
	},
	handler: async (_, args) => {
		await paymentModel.cancelSubscription(args.subscriptionId);
	}
});
