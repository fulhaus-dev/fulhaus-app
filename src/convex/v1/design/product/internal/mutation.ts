import { internalMutation } from '../../../../_generated/server';
import designProductModel from '../model';
import { vCreateDesignProduct } from '../validator';

export const createDesignProduct = internalMutation({
	args: {
		create: vCreateDesignProduct
	},
	handler: async (ctx, args) => await designProductModel.createDesignProduct(ctx, args.create)
});
