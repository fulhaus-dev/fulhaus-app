import { Infer } from 'convex/values';
import { Id } from '../../../_generated/dataModel';
import { MutationCtx, QueryCtx } from '../../../_generated/server';
import { vDesignLog } from './validator';
import userModel from '../../user/model';
import productModel from '../../product/model';

async function saveDesignLogs(
	ctx: MutationCtx,
	workspaceId: Id<'workspaces'>,
	designId: Id<'designs'>,
	args: {
		createdById: Id<'users'>;
		previous: Infer<typeof vDesignLog>;
		current: Infer<typeof vDesignLog>;
	}
) {
	if (Object.keys(args.previous).length < 1 || Object.keys(args.current).length < 1) return;

	return ctx.db.insert('designLogs', {
		...args,
		workspaceId,
		designId
	});
}

async function getDesignLogsByDesignId(ctx: QueryCtx, designId: Id<'designs'>) {
	const designLogs = await ctx.db
		.query('designLogs')
		.withIndex('by_design_id', (q) => q.eq('designId', designId))
		.order('desc')
		.take(100);

	if (designLogs.length < 1)
		return {
			designLogs: [],
			createdBy: [],
			products: []
		};

	const uniqueCreatedByUserIds = Array.from(new Set(designLogs.map((log) => log.createdById)));
	const uniquePreviousProductIds = Array.from(
		new Set(
			designLogs
				.map((log) => log.previous.productIds)
				?.filter((id) => !!id)
				.flat()
		)
	);

	const uniqueCurrentProductIds = Array.from(
		new Set(
			designLogs
				.map((log) => log.current.productIds)
				?.filter((id) => !!id)
				.flat()
		)
	);

	const uniqueProductIds = Array.from(
		new Set([...uniquePreviousProductIds, ...uniqueCurrentProductIds])
	);

	const [createdByUsers, products] = await Promise.all([
		Promise.all(uniqueCreatedByUserIds.map((userId) => userModel.getUserById(ctx, userId))),
		Promise.all(uniqueProductIds.map((productId) => productModel.getProductById(ctx, productId)))
	]);

	return {
		designLogs,
		createdBy: createdByUsers
			.filter((user) => !!user)
			.map((user) => ({
				userId: user._id,
				fullName: user.fullName
			})),
		products
	};
}

const designLogModel = {
	saveDesignLogs,
	getDesignLogsByDesignId
};

export default designLogModel;
