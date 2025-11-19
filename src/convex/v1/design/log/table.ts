import { defineTable } from 'convex/server';
import { v } from 'convex/values';
import { vDesignLog } from './validator';

export const designLogTable = defineTable({
	workspaceId: v.id('workspaces'),
	designId: v.id('designs'),
	previous: vDesignLog,
	current: vDesignLog,
	createdById: v.id('users')
}).index('by_design_id', ['designId']);
