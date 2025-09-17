import { defineTable } from 'convex/server';
import { v } from 'convex/values';

export const ludwigChatTempAssetTable = defineTable({
	chatId: v.id('chats'),
	inspoImageUrl: v.optional(v.string()),
	floorPlanUrl: v.optional(v.string())
}).index('by_chat_id', ['chatId']);
