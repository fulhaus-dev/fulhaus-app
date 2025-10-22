import { Triggers } from 'convex-helpers/server/triggers';
import { DataModel } from '../../../_generated/dataModel';
import productStatisticsModel from './model';
import { customMutation, customCtx } from 'convex-helpers/server/customFunctions';
import { internalMutation, mutation } from '../../../_generated/server';

const triggers = new Triggers<DataModel>();

triggers.register('products', async (ctx, change) => {
	const category = change.newDoc?.category ?? change.oldDoc?.category;
	if (!category) return;

	if (change.operation === 'insert' && change.newDoc) {
		await productStatisticsModel.insertProductCategoryStatistic(
			ctx,
			category,
			change.newDoc.retailPriceUSD,
			change.newDoc.retailPriceCAD
		);
	} else if (change.operation === 'update' && change.oldDoc && change.newDoc) {
		await productStatisticsModel.updateProductCategoryStatistic(
			ctx,
			category,
			change.oldDoc.retailPriceUSD,
			change.oldDoc.retailPriceCAD,
			change.newDoc.retailPriceUSD,
			change.newDoc.retailPriceCAD
		);
	} else if (change.operation === 'delete' && change.oldDoc) {
		await productStatisticsModel.deleteProductCategoryStatistic(
			ctx,
			category,
			change.oldDoc.retailPriceUSD,
			change.oldDoc.retailPriceCAD
		);
	}
});

export const productMutation = customMutation(mutation, customCtx(triggers.wrapDB));
export const productInternalMutation = customMutation(internalMutation, customCtx(triggers.wrapDB));
