import { v } from 'convex/values';
import { query } from '../../../_generated/server';
import authorization from '../../../middleware/authorization';
import workspaceAssetModel from './model';
import { SuccessData } from '../../../response/success';
import { vWorkspaceAssetType } from './validator';

export const getWorkspaceAssets = query({
	args: { workspaceId: v.id('workspaces') },
	handler: async (ctx, { workspaceId }) => {
		await authorization.userIsWorkspaceMember(ctx, workspaceId);

		const workspaceAssets = await workspaceAssetModel.getWorkspaceAssets(ctx, workspaceId);

		return SuccessData(workspaceAssets);
	}
});

export const getWorkspaceAssetsByType = query({
	args: { workspaceId: v.id('workspaces'), type: vWorkspaceAssetType },
	handler: async (ctx, args) => {
		await authorization.userIsWorkspaceMember(ctx, args.workspaceId);

		const workspaceAssets = await workspaceAssetModel.getWorkspaceAssetsByType(ctx, args);

		return SuccessData(workspaceAssets);
	}
});
