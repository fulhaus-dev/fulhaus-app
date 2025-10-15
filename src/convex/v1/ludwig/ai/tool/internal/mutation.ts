import { v } from 'convex/values';
import { internalMutation } from '../../../../../_generated/server';
import { vCreateDesign, vUpdateDesign } from '../../../../design/validator';
import designModel from '../../../../design/model';
import designTagModel from '../../../../design/tag/model';

export const aiCreateDesign = internalMutation({
	args: {
		workspaceId: v.id('workspaces'),
		userId: v.id('users'),
		create: vCreateDesign,
		styles: v.array(v.string())
	},
	handler: async (ctx, args) => {
		const designId = await designModel.createDesign(ctx, args.userId, args.create);

		await designTagModel.saveDesignTags(ctx, args.workspaceId, designId, args.styles);

		return designId;
	}
});

export const aiUpdateDesignById = internalMutation({
	args: {
		workspaceId: v.id('workspaces'),
		designId: v.id('designs'),
		userId: v.id('users'),
		update: vUpdateDesign,
		styles: v.optional(v.array(v.string()))
	},
	handler: async (ctx, args) => {
		return await Promise.all([
			designModel.updateDesignById(ctx, args.designId, args.userId, args.update),
			(args.styles?.length ?? 0) > 0
				? designTagModel.saveDesignTags(ctx, args.workspaceId, args.designId, args.styles!)
				: Promise.resolve()
		]);
	}
});
