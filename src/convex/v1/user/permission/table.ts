import { defineTable } from 'convex/server';
import { v } from 'convex/values';
import { permissionValidator } from './validator';

export const userPermissionTable = defineTable({
	workspaceId: v.id('workspaces'),
	userId: v.id('users'),
	permission: permissionValidator
})
	.index('user_permission', ['workspaceId', 'userId', 'permission'])
	.index('workspace_Id', ['workspaceId'])
	.index('user_Id', ['userId']);
