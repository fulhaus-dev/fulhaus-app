import { MutationCtx, QueryCtx } from '../../_generated/server';
import { Infer } from 'convex/values';
import { Id } from '../../_generated/dataModel';
import date from '../../util/date';
import { vCreateDesign, vUpdateDesign } from './validator';
import productModel from '../product/model';
import { UniqueSpace } from './type';

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
		createdAt: date.now(),
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

async function getDesignProductsByChatId(ctx: QueryCtx, chatId: Id<'chats'>) {
	const design = await getDesignByChatId(ctx, chatId);
	if (!design || !design.productIds) return [];

	return await productModel.getProductsForClientByIds(ctx, design.productIds);
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

async function getDesignTagsForWorkspace(ctx: QueryCtx, workspaceId: Id<'workspaces'>) {
	const workspaceDesignTags: string[] = [];

	let doc = await ctx.db
		.query('designTags')
		.withIndex('by_workspace_tag', (q) => q.eq('workspaceId', workspaceId))
		.order('desc')
		.first();

	while (doc !== null) {
		workspaceDesignTags.push(doc.tag);
		const lastTag = doc.tag;
		doc = await ctx.db
			.query('designTags')
			.withIndex('by_workspace_tag', (q) => q.eq('workspaceId', workspaceId).lt('tag', lastTag))
			.order('desc')
			.first();
	}

	return workspaceDesignTags;
}

async function getDesignTagsByDesignId(ctx: QueryCtx, designId: Id<'designs'>) {
	return await ctx.db
		.query('designTags')
		.withIndex('by_design_id', (q) => q.eq('designId', designId))
		.collect();
}

async function addTagsToDesign(
	ctx: MutationCtx,
	workspaceId: Id<'workspaces'>,
	designId: Id<'designs'>,
	tags: string[]
) {
	const existingDesignTags = await getDesignTagsByDesignId(ctx, designId);
	const tagsToAdd = tags.filter((tag) => !existingDesignTags.some((t) => t.tag === tag));

	if (tagsToAdd.length < 1) return;

	return await Promise.all(
		tagsToAdd.map((tag) =>
			ctx.db.insert('designTags', {
				workspaceId,
				designId,
				tag
			})
		)
	);
}

async function deleteDesignTag(ctx: MutationCtx, designTagId: Id<'designTags'>) {
	return await ctx.db.delete(designTagId);
}

const designModel = {
	createDesign,
	getDesignById,
	getDesignByChatId,
	getDesignsByWorkspaceId,
	updateDesignById,
	getDesignProductsByChatId,
	getExistingDesignsWithFloorPlanUrl,
	getUniqueDesignSpacesForWorkspace,
	getDesignTagsForWorkspace,
	addTagsToDesign,
	getDesignTagsByDesignId,
	deleteDesignTag
};

export default designModel;
