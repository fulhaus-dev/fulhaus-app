import { defineTable } from 'convex/server';
import { v } from 'convex/values';
import { vChatMessage, vLlmUsage } from './validator';

export const chatTable = defineTable({
	workspaceId: v.id('workspaces'),
	createdById: v.id('users'),
	createdAt: v.number()
}).index('workspace_chat', ['workspaceId']);

export const chatMessageTable = defineTable({
	workspaceId: v.id('workspaces'),
	chatId: v.id('chats'),
	message: vChatMessage,
	usage: v.optional(vLlmUsage),
	createdById: v.id('users'),
	createdAt: v.number()
}).index('workspace_chat_message', ['workspaceId', 'chatId']);

export const chatResponseStreamTable = defineTable({
	workspaceId: v.id('workspaces'),
	chatId: v.id('chats'),
	stream: v.object({
		type: v.string(),
		id: v.optional(v.string()),
		delta: v.optional(v.string())
	})
}).index('workspace_chat_response_stream', ['workspaceId', 'chatId']);
