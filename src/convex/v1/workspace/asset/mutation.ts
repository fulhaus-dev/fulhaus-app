import { mutation } from '../../../_generated/server';
import authorization from '../../../middleware/authorization';
import workspaceAssetModel from './model';
import { vSaveWorkspaceAssetFields } from './validator';

export const saveWorkspaceAsset = mutation({
	args: vSaveWorkspaceAssetFields,
	handler: async (ctx, args) => {
		const userId = await authorization.workspaceMemberIsAuthorizedToPerformFunction(
			ctx,
			args.workspaceId,
			'createDesign'
		);

		await workspaceAssetModel.saveWorkspaceAsset(ctx, { ...args, createdById: userId });
	}
});
