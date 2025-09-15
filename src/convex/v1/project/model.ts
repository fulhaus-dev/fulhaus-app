import { MutationCtx, QueryCtx } from '../../_generated/server';
import { Infer } from 'convex/values';
import { Id } from '../../_generated/dataModel';
import date from '../../util/date';
import { vCreateProject, vUpdateProject } from './validator';

async function createProject(
	ctx: MutationCtx,
	userId: Id<'users'>,
	args: Infer<typeof vCreateProject>
) {
	return await ctx.db.insert('projects', {
		...args,
		createdById: userId,
		updatedById: userId,
		createdAt: date.now(),
		updatedAt: date.now()
	});
}

async function getProjectById(ctx: QueryCtx, projectId: Id<'projects'>) {
	return await ctx.db.get(projectId);
}

async function getWorkspaceProjects(ctx: QueryCtx, workspaceId: Id<'workspaces'>) {
	return await ctx.db
		.query('projects')
		.withIndex('by_workspace_id', (q) => q.eq('workspaceId', workspaceId))
		.take(100);
}

async function updateProjectById(
	ctx: MutationCtx,
	projectId: Id<'projects'>,
	userId: Id<'users'>,
	args: Infer<typeof vUpdateProject>
) {
	return await ctx.db.patch(projectId, { ...args, updatedById: userId, updatedAt: date.now() });
}

const projectModel = {
	createProject,
	getProjectById,
	getWorkspaceProjects,
	updateProjectById
};

export default projectModel;
