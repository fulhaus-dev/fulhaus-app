import { TableAggregate } from '@convex-dev/aggregate';
import { DataModel } from '../../_generated/dataModel';
import { components } from '../../_generated/api';
import { Triggers } from 'convex-helpers/server/triggers';
import { customCtx, customMutation } from 'convex-helpers/server/customFunctions';
import { internalMutation, mutation } from '../../_generated/server';
import { ProductCategory } from './type';

const triggers = new Triggers<DataModel>();

export const productCategoryAggregate = new TableAggregate<{
	Namespace: ProductCategory;
	Key: number;
	DataModel: DataModel;
	TableName: 'products';
}>(components.productCategoryAggregate, {
	namespace: (doc) => doc.category,
	sortKey: (doc) => doc._creationTime
});

triggers.register('products', productCategoryAggregate.trigger());
export const productMutation = customMutation(mutation, customCtx(triggers.wrapDB));
export const productInternalMutation = customMutation(internalMutation, customCtx(triggers.wrapDB));
