import { Infer } from 'convex/values';
import { MutationCtx, QueryCtx } from '../../../_generated/server';
import { workspaceAssetTable } from './table';
import { Id } from '../../../_generated/dataModel';
import { vWorkspaceAssetType } from './validator';

async function saveWorkspaceAsset(
	ctx: MutationCtx,
	args: Infer<typeof workspaceAssetTable.validator>
) {
	const currentWorkspaceAsset = await getWorkspaceAssetByUrl(ctx, args.url);
	if (currentWorkspaceAsset) return currentWorkspaceAsset._id;

	return await ctx.db.insert('workspaceAssets', args);
}

async function getWorkspaceAssetByUrl(ctx: QueryCtx, url: string) {
	return await ctx.db
		.query('workspaceAssets')
		.withIndex('by_url', (q) => q.eq('url', url))
		.first();
}

async function getWorkspaceAssets(ctx: QueryCtx, workspaceId: Id<'workspaces'>) {
	return await ctx.db
		.query('workspaceAssets')
		.withIndex('workspace_id', (q) => q.eq('workspaceId', workspaceId))
		.take(100);
}

async function getWorkspaceAssetsByType(
	ctx: QueryCtx,
	args: { workspaceId: Id<'workspaces'>; type: Infer<typeof vWorkspaceAssetType> }
) {
	return await ctx.db
		.query('workspaceAssets')
		.withIndex('workspace_assets_by_type', (q) =>
			q.eq('workspaceId', args.workspaceId).eq('type', args.type)
		)
		.take(100);
}

const workspaceAssetModel = {
	saveWorkspaceAsset,
	getWorkspaceAssetByUrl,
	getWorkspaceAssets,
	getWorkspaceAssetsByType
};
export default workspaceAssetModel;
