import { query } from '../../../_generated/server';
import authorization from '../../../middleware/authorization';
import { SuccessData } from '../../../response/success';
import { vSpaceType } from '../validator';
import designProductModel from './model';

export const getProductCategoriesForSpace = query({
	args: {
		spaceType: vSpaceType
	},
	handler: async (ctx, args) => {
		await authorization.userIsAuthenticated(ctx);

		const productCategories = designProductModel.getProductCategoriesForSpace(args.spaceType);

		return SuccessData(productCategories.all ?? []);
	}
});
