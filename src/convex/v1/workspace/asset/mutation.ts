import { mutation } from '../../../_generated/server';
import authorization from '../../../middleware/authorization';
import workspaceAssetModel from './model';
import { vSaveWorkspaceAsset } from './validator';

export const saveWorkspaceAsset = mutation({
	args: vSaveWorkspaceAsset,
	handler: async (ctx, args) => {
		const userId = await authorization.workspaceMemberIsAuthorizedToPerformFunction(
			ctx,
			args.workspaceId,
			'createDesign'
		);

		await workspaceAssetModel.saveWorkspaceAsset(ctx, { ...args, createdById: userId });
	}
});
