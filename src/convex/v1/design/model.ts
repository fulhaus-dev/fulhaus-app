import { MutationCtx, QueryCtx } from '../../_generated/server';
import { Infer } from 'convex/values';
import { Id } from '../../_generated/dataModel';
import date from '../../util/date';
import { vCreateDesign, vUpdateDesign } from './validator';
import productModel from '../product/model';
import { UniqueSpace } from './type';
import { CurrencyCode } from '../../type';

async function createDesign(
	ctx: MutationCtx,
	userId: Id<'users'>,
	args: Infer<typeof vCreateDesign>
) {
	return await ctx.db.insert('designs', {
		...args,
		floorPlanUrl: args.floorPlanFile?.url,
		createdById: userId,
		updatedById: userId,
		updatedAt: date.now()
	});
}

async function getDesignById(ctx: QueryCtx, designId: Id<'designs'>) {
	return await ctx.db.get(designId);
}

async function getDesignByChatId(ctx: QueryCtx, chatId: Id<'chats'>) {
	return await ctx.db
		.query('designs')
		.withIndex('by_chat_id', (q) => q.eq('chatId', chatId))
		.first();
}

async function getDesignsByWorkspaceId(ctx: QueryCtx, workspaceId: Id<'workspaces'>) {
	return await ctx.db
		.query('designs')
		.withIndex('by_workspace_id', (q) => q.eq('workspaceId', workspaceId))
		.take(100);
}

async function updateDesignById(
	ctx: MutationCtx,
	designId: Id<'designs'>,
	userId: Id<'users'>,
	args: Infer<typeof vUpdateDesign>
) {
	if (args.floorPlanFile) args.floorPlanUrl = args.floorPlanFile?.url;

	return await ctx.db.patch(designId, {
		...args,
		updatedById: userId,
		updatedAt: date.now()
	});
}

async function getDesignProductsByChatId(
	ctx: QueryCtx,
	chatId: Id<'chats'>,
	currencyCode: CurrencyCode
) {
	const design = await getDesignByChatId(ctx, chatId);
	if (!design || !design.productIds) return [];

	return await productModel.getProductsForClientByIds(ctx, {
		productIds: design.productIds,
		currencyCode
	});
}

async function getExistingDesignsWithFloorPlanUrl(ctx: QueryCtx, floorPlanUrl: string) {
	return await ctx.db
		.query('designs')
		.withIndex('by_floor_plan_url', (q) => q.eq('floorPlanUrl', floorPlanUrl))
		.take(100);
}

async function getUniqueDesignSpacesForWorkspace(ctx: QueryCtx, workspaceId: Id<'workspaces'>) {
	const uniqueSpaces: UniqueSpace[] = [];

	let doc = await ctx.db
		.query('designs')
		.withIndex('by_workspace_space', (q) => q.eq('workspaceId', workspaceId))
		.order('desc')
		.first();

	while (doc !== null) {
		uniqueSpaces.push({
			spaceType: doc.spaceType,
			imageUrl: doc.renderedImageUrl ?? doc.inspirationImageUrl
		});
		const lastSpace = doc.spaceType;
		doc = await ctx.db
			.query('designs')
			.withIndex('by_workspace_space', (q) =>
				q.eq('workspaceId', workspaceId).lt('spaceType', lastSpace)
			)
			.order('desc')
			.first();
	}

	return uniqueSpaces;
}

const designModel = {
	createDesign,
	getDesignById,
	getDesignByChatId,
	getDesignsByWorkspaceId,
	updateDesignById,
	getDesignProductsByChatId,
	getExistingDesignsWithFloorPlanUrl,
	getUniqueDesignSpacesForWorkspace
};

export default designModel;
