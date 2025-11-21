import { MutationCtx, QueryCtx } from '../../../_generated/server';
import { Infer } from 'convex/values';
import { vCreateVendor } from './validator';
import date from '../../../util/date';
import { Id } from '../../../_generated/dataModel';

async function createProductVendor(ctx: MutationCtx, args: Infer<typeof vCreateVendor>) {
	return await ctx.db.insert('productVendors', {
		...args,
		updatedAt: date.now()
	});
}

async function getProductVendor(ctx: QueryCtx, vendorId: Id<'productVendors'>) {
	return await ctx.db.get(vendorId);
}

const productVendorModel = {
	createProductVendor,
	getProductVendor
};

export default productVendorModel;
