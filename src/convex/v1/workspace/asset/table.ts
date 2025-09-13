import { defineTable } from 'convex/server';
import { v } from 'convex/values';
import { vSaveWorkspaceAssetFields } from './validator';

export const workspaceAssetTable = defineTable({
	...vSaveWorkspaceAssetFields,
	createdById: v.id('users')
})
	.index('workspace_id', ['workspaceId'])
	.index('workspace_assets_by_type', ['workspaceId', 'type']);
