import { defineTable } from 'convex/server';
import { v } from 'convex/values';
import { vSaveWorkspaceAsset } from './validator';

export const workspaceAssetTable = defineTable({
	...vSaveWorkspaceAsset,
	createdById: v.id('users')
}).index('workspace_id', ['workspaceId']);
