import { Id } from '../../../_generated/dataModel';
import { MutationCtx, QueryCtx } from '../../../_generated/server';
import { SpaceType } from '../type';
import { spaceTypeProductCategories } from './constant';
import date from '../../../util/date';
import { Infer } from 'convex/values';
import { vCreateDesignProduct } from './validator';
import designModel from '../model';

function getDesignProductCategoriesForSpace(spaceType: SpaceType) {
	return spaceTypeProductCategories[spaceType];
}

async function createDesignProduct(ctx: MutationCtx, args: Infer<typeof vCreateDesignProduct>) {
	return await ctx.db.insert('designProducts', {
		...args,
		createdAt: date.now()
	});
}

async function getDesignProductById(ctx: QueryCtx, designProductId: Id<'designProducts'>) {
	return await ctx.db.get(designProductId);
}

async function getDesignProductsByChatId(ctx: QueryCtx, chatId: Id<'chats'>) {
	const [design, designProducts] = await Promise.all([
		designModel.getDesignsByChatId(ctx, chatId),
		ctx.db
			.query('designProducts')
			.withIndex('by_chat_id', (q) => q.eq('chatId', chatId))
			.take(100)
	]);

	return { design, designProducts };
}

const designProductModel = {
	getDesignProductCategoriesForSpace,
	createDesignProduct,
	getDesignProductById,
	getDesignProductsByChatId
};
export default designProductModel;
