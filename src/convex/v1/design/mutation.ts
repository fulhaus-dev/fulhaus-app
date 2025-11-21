import { mutation } from '../../_generated/server';
import authorization from '../../middleware/authorization';
import { v } from 'convex/values';
import { vDesignProductCategory, vUpdateDesign } from './validator';
import designModel from './model';
import { internal } from '../../_generated/api';
import object from '../../util/object';

export const updateDesignById = mutation({
	args: {
		workspaceId: v.id('workspaces'),
		designId: v.id('designs'),
		updates: vUpdateDesign
	},
	handler: async (ctx, args) => {
		const userId = await authorization.workspaceMemberIsAuthorizedToPerformFunction(
			ctx,
			args.workspaceId,
			'createDesign'
		);

		const currentDesign = await designModel.getDesignById(ctx, args.designId);
		if (!currentDesign) return;

		const updates = args.updates;
		const dataToUpdate = object.getDifference(currentDesign, updates);

		if (
			dataToUpdate.productIds &&
			currentDesign.productIds?.length === updates.productIds?.length
		) {
			const renderSwappedProductIds = dataToUpdate.productIds.filter(
				(dataToUpdateProductId) => !currentDesign.productIds?.includes(dataToUpdateProductId)
			);

			dataToUpdate.renderSwappedProductIds = renderSwappedProductIds;
		}

		await designModel.updateDesignById(ctx, args.designId, userId, dataToUpdate);

		if (dataToUpdate.productCategories || dataToUpdate.inspirationImageUrl) {
			await ctx.scheduler.runAfter(
				0,
				internal.v1.design.internal.action.generateDesignFurnitureRecommendation,
				{
					currencyCode: currentDesign.currencyCode,
					designId: args.designId,
					userId
				}
			);

			return;
		}
	}
});

export const addNewProductToDesignById = mutation({
	args: {
		workspaceId: v.id('workspaces'),
		designId: v.id('designs'),
		update: v.object({
			productId: v.id('products'),
			productCategory: vDesignProductCategory
		})
	},
	handler: async (ctx, args) => {
		const userId = await authorization.workspaceMemberIsAuthorizedToPerformFunction(
			ctx,
			args.workspaceId,
			'createDesign'
		);

		const currentDesign = await designModel.getDesignById(ctx, args.designId);
		if (!currentDesign) return;

		await designModel.updateDesignById(ctx, args.designId, userId, {
			productIds: [...(currentDesign.productIds ?? []), args.update.productId],
			productCategories: [...(currentDesign.productCategories ?? []), args.update.productCategory]
		});
	}
});

export const removeProductFromDesignById = mutation({
	args: {
		workspaceId: v.id('workspaces'),
		designId: v.id('designs'),
		remove: v.object({
			productId: v.id('products'),
			productCategory: vDesignProductCategory
		})
	},
	handler: async (ctx, args) => {
		const userId = await authorization.workspaceMemberIsAuthorizedToPerformFunction(
			ctx,
			args.workspaceId,
			'createDesign'
		);

		const currentDesign = await designModel.getDesignById(ctx, args.designId);
		if (!currentDesign) return;

		await designModel.updateDesignById(ctx, args.designId, userId, {
			productIds: (currentDesign.productIds ?? []).filter((id) => id !== args.remove.productId),
			productCategories: (currentDesign.productCategories ?? []).filter(
				(productCategory) => productCategory.category !== args.remove.productCategory.category
			)
		});
	}
});

export const archiveDesigns = mutation({
	args: {
		workspaceId: v.id('workspaces'),
		designIds: v.array(v.id('designs'))
	},
	handler: async (ctx, args) => {
		await authorization.workspaceMemberIsAuthorizedToPerformFunction(
			ctx,
			args.workspaceId,
			'createDesign'
		);

		await Promise.all(args.designIds.map((designId) => designModel.archiveDesign(ctx, designId)));
	}
});

export const regenerateRender = mutation({
	args: {
		workspaceId: v.id('workspaces'),
		designId: v.id('designs')
	},
	handler: async (ctx, args) => {
		const userId = await authorization.workspaceMemberIsAuthorizedToPerformFunction(
			ctx,
			args.workspaceId,
			'createDesign'
		);

		await authorization.hasRenderCredits(ctx, args.workspaceId);

		await ctx.scheduler.runAfter(0, internal.v1.design.internal.action.generateDesignRender, {
			designId: args.designId,
			userId
		});
	}
});
