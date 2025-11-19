import { v } from 'convex/values';
import { query } from '../../../_generated/server';
import authorization from '../../../middleware/authorization';
import { SuccessData } from '../../../response/success';
import designLogModel from './model';

export const getDesignLogsByDesignId = query({
	args: {
		workspaceId: v.id('workspaces'),
		designId: v.id('designs')
	},
	handler: async (ctx, args) => {
		await authorization.userIsWorkspaceMember(ctx, args.workspaceId);

		const response = await designLogModel.getDesignLogsByDesignId(ctx, args.designId);

		return SuccessData(response);
	}
});
