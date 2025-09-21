import { defineTable } from 'convex/server';
import { v } from 'convex/values';
import { vFloorPlanFile } from '../../validator';

export const ludwigChatTempAssetTable = defineTable({
	chatId: v.id('chats'),
	inspoImageUrl: v.optional(v.string()),
	floorPlanFile: v.optional(vFloorPlanFile)
}).index('by_chat_id', ['chatId']);
