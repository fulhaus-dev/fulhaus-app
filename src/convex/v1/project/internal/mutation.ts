import { v } from 'convex/values';
import { internalMutation } from '../../../_generated/server';
import { vCreateProject, vUpdateProject } from '../validator';
import projectModel from '../model';

export const createProject = internalMutation({
	args: {
		userId: v.id('users'),
		create: vCreateProject
	},
	handler: async (ctx, args) => await projectModel.createProject(ctx, args.userId, args.create)
});

export const updateProjectById = internalMutation({
	args: {
		projectId: v.id('projects'),
		userId: v.id('users'),
		update: vUpdateProject
	},
	handler: async (ctx, args) =>
		await projectModel.updateProjectById(ctx, args.projectId, args.userId, args.update)
});

export const updateProjectFloorPlans = internalMutation({
	args: {
		projectId: v.id('projects'),
		userId: v.id('users'),
		newFloorPlanUrls: v.array(v.string())
	},
	handler: async (ctx, args) =>
		await projectModel.updateProjectFloorPlans(
			ctx,
			args.projectId,
			args.userId,
			args.newFloorPlanUrls
		)
});
