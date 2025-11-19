import { MutationCtx, QueryCtx } from '../../_generated/server';
import { Infer } from 'convex/values';
import { Id } from '../../_generated/dataModel';
import date from '../../util/date';
import { vCreateDesign, vUpdateDesign } from './validator';
import productModel from '../product/model';
import { UniqueSpace } from './type';
import { CurrencyCode } from '../../type';
import designUtil from './util';
import designLogModel from './log/model';

async function createDesign(
	ctx: MutationCtx,
	userId: Id<'users'>,
	args: Infer<typeof vCreateDesign>
) {
	return await ctx.db.insert('designs', {
		...args,
		floorPlanUrl: args.floorPlanFile?.url,
		fullTextSearch: `${args.name} | ${args.description} | ${args.spaceType}`,
		createdById: userId,
		updatedById: userId,
		updatedAt: date.now()
	});
}

async function getDesignById(ctx: QueryCtx, designId: Id<'designs'>) {
	const design = await ctx.db.get(designId);
	if (design?.deletedAt) return null;

	return design;
}

async function getDesignByChatId(ctx: QueryCtx, chatId: Id<'chats'>, currencyCode: CurrencyCode) {
	const design = await ctx.db
		.query('designs')
		.withIndex('by_chat_id', (q) => q.eq('chatId', chatId).eq('currencyCode', currencyCode))
		.first();
	if (design?.deletedAt) return null;

	return design;
}

async function getDesignsByWorkspaceId(
	ctx: QueryCtx,
	workspaceId: Id<'workspaces'>,
	currencyCode: CurrencyCode
) {
	return await ctx.db
		.query('designs')
		.withIndex('by_workspace_id', (q) =>
			q.eq('workspaceId', workspaceId).eq('currencyCode', currencyCode)
		)
		.filter((q) => q.eq(q.field('deletedAt'), undefined))
		.take(100);
}

async function updateDesignById(
	ctx: MutationCtx,
	designId: Id<'designs'>,
	userId: Id<'users'>,
	args: Infer<typeof vUpdateDesign>
) {
	if (args.floorPlanFile) args.floorPlanUrl = args.floorPlanFile?.url;

	const design = await getDesignById(ctx, designId);
	if (!design) return;

	const designLog = designUtil.getDesignLog(design, args);

	await Promise.all([
		ctx.db.patch(designId, {
			...args,
			updatedById: userId,
			updatedAt: date.now()
		}),
		designLogModel.saveDesignLogs(ctx, design.workspaceId, designId, {
			...designLog,
			createdById: userId
		})
	]);
}

async function getDesignProducts(
	ctx: QueryCtx,
	designId: Id<'designs'>,
	currencyCode: CurrencyCode
) {
	const design = await getDesignById(ctx, designId);
	if (!design || !design.productIds) return [];

	return await productModel.getProductsForClientByIds(ctx, {
		productIds: design.productIds,
		currencyCode
	});
}

async function getDesignProductsByChatId(
	ctx: QueryCtx,
	chatId: Id<'chats'>,
	currencyCode: CurrencyCode
) {
	const design = await getDesignByChatId(ctx, chatId, currencyCode);
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
		.filter((q) => q.eq(q.field('deletedAt'), undefined))
		.take(100);
}

async function getUniqueDesignSpacesForWorkspace(
	ctx: QueryCtx,
	workspaceId: Id<'workspaces'>,
	currencyCode: CurrencyCode
) {
	const uniqueSpaces: UniqueSpace[] = [];

	let doc = await ctx.db
		.query('designs')
		.withIndex('by_workspace_space', (q) =>
			q.eq('workspaceId', workspaceId).eq('currencyCode', currencyCode)
		)
		.filter((q) => q.eq(q.field('deletedAt'), undefined))
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
				q.eq('workspaceId', workspaceId).eq('currencyCode', currencyCode).lt('spaceType', lastSpace)
			)
			.filter((q) => q.eq(q.field('deletedAt'), undefined))
			.order('desc')
			.first();
	}

	return uniqueSpaces;
}

async function archiveDesign(ctx: MutationCtx, designId: Id<'designs'>) {
	return await ctx.db.patch(designId, {
		deletedAt: date.now()
	});
}

const designModel = {
	createDesign,
	getDesignById,
	getDesignByChatId,
	getDesignsByWorkspaceId,
	updateDesignById,
	getDesignProducts,
	getDesignProductsByChatId,
	getExistingDesignsWithFloorPlanUrl,
	getUniqueDesignSpacesForWorkspace,
	archiveDesign
};

export default designModel;

// Dave Lazar
// Baby Bedroom
// Wallpaper
