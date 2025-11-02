import { Id } from '../../../_generated/dataModel';
import { MutationCtx, QueryCtx } from '../../../_generated/server';

async function saveDesignTags(
	ctx: MutationCtx,
	workspaceId: Id<'workspaces'>,
	designId: Id<'designs'>,
	tags: string[]
) {
	const existingDesignTags = await getDesignTagsByDesignId(ctx, designId);
	const tagsToAdd = tags.filter((tag) => !existingDesignTags.some((t) => t.tag === tag));

	if (tagsToAdd.length < 1) return;

	const newDesignTags = await Promise.all(
		tagsToAdd.map((tag) =>
			ctx.db.insert('designTags', {
				workspaceId,
				designId,
				tag
			})
		)
	);

	return newDesignTags;
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

async function deleteDesignTag(ctx: MutationCtx, designTagId: Id<'designTags'>) {
	return await ctx.db.delete(designTagId);
}

const designTagModel = {
	saveDesignTags,
	getDesignTagsForWorkspace,
	getDesignTagsByDesignId,
	deleteDesignTag
};

export default designTagModel;
