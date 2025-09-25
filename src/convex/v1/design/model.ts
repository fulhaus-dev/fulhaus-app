import { MutationCtx, QueryCtx } from '../../_generated/server';
import { Infer } from 'convex/values';
import { Id } from '../../_generated/dataModel';
import date from '../../util/date';
import { vCreateDesign, vUpdateDesign } from './validator';
import productModel from '../product/model';

async function createDesign(
	ctx: MutationCtx,
	userId: Id<'users'>,
	args: Infer<typeof vCreateDesign>
) {
	return await ctx.db.insert('designs', {
		...args,
		createdById: userId,
		updatedById: userId,
		createdAt: date.now(),
		updatedAt: date.now()
	});
}

async function getDesignById(ctx: QueryCtx, designId: Id<'designs'>) {
	return await ctx.db.get(designId);
}

async function getProjectDesigns(ctx: QueryCtx, projectId: Id<'projects'>) {
	return await ctx.db
		.query('designs')
		.withIndex('by_project_id', (q) => q.eq('projectId', projectId))
		.take(100);
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
	return await ctx.db.patch(designId, { ...args, updatedById: userId, updatedAt: date.now() });
}

async function getDesignProductsByChatId(ctx: QueryCtx, chatId: Id<'chats'>) {
	const design = await getDesignByChatId(ctx, chatId);
	if (!design || !design.productIds) return [];

	return await productModel.getProductsForClientByIds(ctx, design.productIds);
}

const designModel = {
	createDesign,
	getDesignById,
	getProjectDesigns,
	getDesignByChatId,
	getDesignsByWorkspaceId,
	updateDesignById,
	getDesignProductsByChatId
};

export default designModel;
