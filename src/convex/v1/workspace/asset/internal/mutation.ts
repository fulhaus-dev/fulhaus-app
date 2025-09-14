import { internalMutation } from '../../../../_generated/server';
import workspaceAssetModel from '../model';
import { workspaceAssetTable } from '../table';

export const saveWorkspaceAsset = internalMutation({
	args: workspaceAssetTable.validator,
	handler: async (ctx, args) => {
		await workspaceAssetModel.saveWorkspaceAsset(ctx, args);
	}
});
