import { MutationCtx, QueryCtx } from '../../_generated/server';
import { Id } from '../../_generated/dataModel';
import { FloorPlanFile } from '../../type';

async function createChatTempAsset(
	ctx: MutationCtx,
	chatId: Id<'chats'>,
	assets: { inspoImageUrl?: string; floorPlanFile?: FloorPlanFile; spaceImage?: string }
) {
	return await ctx.db.insert('ludwigChatTempAssets', {
		chatId,
		...assets
	});
}

async function getChatTempAssetsByChatId(ctx: QueryCtx, chatId: Id<'chats'>) {
	return await ctx.db
		.query('ludwigChatTempAssets')
		.withIndex('by_chat_id', (q) => q.eq('chatId', chatId))
		.first();
}

async function updateChatTempAssetsByChatId(
	ctx: MutationCtx,
	ludwigChatTempAssetsId: Id<'ludwigChatTempAssets'>,
	update: { inspoImageUrl?: string; floorPlanFile?: FloorPlanFile; spaceImage?: string }
) {
	return await ctx.db.patch(ludwigChatTempAssetsId, update);
}

async function setChatTempAssetByChatId(
	ctx: MutationCtx,
	chatId: Id<'chats'>,
	assets: { inspoImageUrl?: string; floorPlanFile?: FloorPlanFile; spaceImage?: string }
) {
	const ludwigChatTempAsset = await getChatTempAssetsByChatId(ctx, chatId);

	if (ludwigChatTempAsset) await updateChatTempAssetsByChatId(ctx, ludwigChatTempAsset._id, assets);

	if (!ludwigChatTempAsset) await createChatTempAsset(ctx, chatId, assets);
}

async function deleteChatTempAssetByChatId(ctx: MutationCtx, chatId: Id<'chats'>) {
	const ludwigChatTempAsset = await getChatTempAssetsByChatId(ctx, chatId);

	if (ludwigChatTempAsset) await ctx.db.delete(ludwigChatTempAsset._id);
}

const ludwigModel = {
	createChatTempAsset,
	getChatTempAssetsByChatId,
	updateChatTempAssetsByChatId,
	setChatTempAssetByChatId,
	deleteChatTempAssetByChatId
};
export default ludwigModel;
