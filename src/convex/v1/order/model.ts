import { Infer } from 'convex/values';
import { Id } from '../../_generated/dataModel';
import { MutationCtx, QueryCtx } from '../../_generated/server';
import { vCreateOrderItem } from './validator';
import shortid from 'shortid';
import productModel from '../product/model';

async function createOrderItems(
	ctx: MutationCtx,
	workspaceId: Id<'workspaces'>,
	args: Infer<typeof vCreateOrderItem>[]
) {
	const oidSuffix = shortid.generate();
	const oid = `ORD-${workspaceId}-${oidSuffix.replace(/[^a-zA-Z0-9]/g, '')}`;

	await Promise.all(
		args.map((args) =>
			ctx.db.insert('orderItems', {
				...args,
				workspaceId,
				oid,
				status: 'pending'
			})
		)
	);

	return oid;
}

async function getOrderItemsByOid(ctx: QueryCtx, oid: string) {
	const orderItems = await ctx.db
		.query('orderItems')
		.withIndex('by_oid', (q) => q.eq('oid', oid))
		.collect();

	const productIds = [...new Set(orderItems.map((item) => item.productId))];

	const orderProducts = await Promise.all(
		productIds.map((productId) => productModel.getOrderProduct(ctx, productId))
	);

	const validOrderProducts = orderProducts.filter((product) => !!product);

	const orderItemsWithProduct = orderItems.map((item) => ({
		...item,
		orderProduct: validOrderProducts.find(
			(orderProduct) => orderProduct.productId === item.productId
		)
	}));

	return orderItemsWithProduct.filter((item) => !!item.orderProduct);
}

const orderModel = {
	createOrderItems,
	getOrderItemsByOid
};
export default orderModel;
