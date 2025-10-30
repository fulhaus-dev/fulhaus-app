import { defineTable } from 'convex/server';
import { v } from 'convex/values';
import { vWorkspacePlan } from './validator';

export const workspacePlanTable = defineTable({
	workspaceId: v.id('workspaces'),
	credit: v.number(),
	used: v.number(),
	plan: vWorkspacePlan
}).index('workspace_id', ['workspaceId']);
