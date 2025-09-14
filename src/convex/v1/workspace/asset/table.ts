import { defineTable } from 'convex/server';
import { v } from 'convex/values';
import { vAssetMetadata, vWorkspaceAssetType } from './validator';

export const workspaceAssetTable = defineTable({
	workspaceId: v.id('workspaces'),
	type: vWorkspaceAssetType,
	url: v.string(),
	metadata: vAssetMetadata,
	createdById: v.id('users')
})
	.index('workspace_id', ['workspaceId'])
	.index('workspace_assets_by_type', ['workspaceId', 'type']);
