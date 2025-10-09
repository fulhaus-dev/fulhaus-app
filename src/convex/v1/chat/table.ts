import { defineTable } from 'convex/server';
import { v } from 'convex/values';
import { vChatUiMessage, vChatUsage } from './validator';

export const chatTable = defineTable({
	workspaceId: v.id('workspaces'),
	designId: v.optional(v.id('designs')),
	createdById: v.id('users')
}).index('workspace_chat', ['workspaceId']);

export const chatUiMessageTable = defineTable({
	workspaceId: v.id('workspaces'),
	chatId: v.id('chats'),
	message: vChatUiMessage,
	createdById: v.id('users')
}).index('workspace_chat_message', ['workspaceId', 'chatId']);

export const chatUsageTokenTable = defineTable({
	workspaceId: v.id('workspaces'),
	chatId: v.id('chats'),
	usage: vChatUsage
}).index('workspace_chat_usage', ['workspaceId', 'chatId']);
