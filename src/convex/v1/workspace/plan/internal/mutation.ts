import { v } from 'convex/values';
import workspacePlanModel from '../model';
import { vUpdateWorkspacePlan } from '../validator';
import { internalMutation } from '../../../../_generated/server';
import { vCurrencyCode } from '../../../../validator';

export const updateWorkspacePlanByWorkspaceId = internalMutation({
	args: {
		workspaceId: v.id('workspaces'),
		userId: v.id('users'),
		currencyCode: vCurrencyCode,
		update: vUpdateWorkspacePlan
	},
	handler: async (ctx, args) => {
		return await workspacePlanModel.updateWorkspacePlanByWorkspaceId(ctx, args);
	}
});

export const updateWorkspaceCreditsUsed = internalMutation({
	args: {
		workspaceId: v.id('workspaces'),
		creditsUsed: v.number()
	},
	handler: async (ctx, args) => {
		return await workspacePlanModel.updateWorkspaceCreditsUsed(
			ctx,
			args.workspaceId,
			args.creditsUsed
		);
	}
});
