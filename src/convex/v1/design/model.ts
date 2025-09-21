import { MutationCtx, QueryCtx } from '../../_generated/server';
import { Infer } from 'convex/values';
import { Id } from '../../_generated/dataModel';
import date from '../../util/date';
import { vCreateDesign, vUpdateDesign } from './validator';

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

async function getDesignsByChatId(ctx: QueryCtx, chatId: Id<'chats'>) {
	return await ctx.db
		.query('designs')
		.withIndex('by_chat_id', (q) => q.eq('chatId', chatId))
		.first();
}

async function updateDesignById(
	ctx: MutationCtx,
	designId: Id<'designs'>,
	userId: Id<'users'>,
	args: Infer<typeof vUpdateDesign>
) {
	return await ctx.db.patch(designId, { ...args, updatedById: userId, updatedAt: date.now() });
}

const designModel = {
	createDesign,
	getDesignById,
	getProjectDesigns,
	getDesignsByChatId,
	updateDesignById
};

export default designModel;
