import { MutationCtx } from '../../../_generated/server';
import { Infer } from 'convex/values';
import { vCreateVendor } from './validator';
import date from '../../../util/date';

async function createProductVendor(ctx: MutationCtx, args: Infer<typeof vCreateVendor>) {
	return await ctx.db.insert('productVendors', {
		...args,
		updatedAt: date.now()
	});
}

const productVendorModel = {
	createProductVendor
};

export default productVendorModel;
