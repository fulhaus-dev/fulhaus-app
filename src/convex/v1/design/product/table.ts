import { defineTable } from 'convex/server';
import { v } from 'convex/values';
import { vProductCategory } from './validator';

export const designProductTable = defineTable({
	workspaceId: v.id('workspaces'),
	projectId: v.id('projects'),
	chatId: v.id('chats'),
	designId: v.id('designs'),
	productId: v.string(),
	name: v.string(),
	imageUrl: v.string(),
	category: vProductCategory,
	createdAt: v.number()
})
	.index('by_design_id', ['designId'])
	.index('by_chat_id', ['chatId']);
