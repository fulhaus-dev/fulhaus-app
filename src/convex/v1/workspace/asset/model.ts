import { Infer } from 'convex/values';
import { MutationCtx } from '../../../_generated/server';
import { workspaceAssetTable } from './table';

async function saveWorkspaceAsset(
	ctx: MutationCtx,
	args: Infer<typeof workspaceAssetTable.validator>
) {
	return await ctx.db.insert('workspaceAssets', args);
}

const workspaceAssetModel = {
	saveWorkspaceAsset
};
export default workspaceAssetModel;
