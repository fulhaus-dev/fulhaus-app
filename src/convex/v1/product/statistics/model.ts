import { MutationCtx, QueryCtx } from '../../../_generated/server';
import { ProductCategory } from '../type';

async function getAllProductCategoryStatistic(ctx: QueryCtx) {
	return await ctx.db.query('productCategoryStatistics').collect();
}

async function getProductCategoryStatisticByCategory(ctx: QueryCtx, category: ProductCategory) {
	return await ctx.db
		.query('productCategoryStatistics')
		.withIndex('by_category', (q) => q.eq('category', category))
		.first();
}

async function insertProductCategoryStatistic(
	ctx: MutationCtx,
	category: ProductCategory,
	retailPriceUSD: number = 0,
	retailPriceCAD: number = 0
) {
	const currentStat = await getProductCategoryStatisticByCategory(ctx, category);

	if (!currentStat) {
		// Create new stat document
		return await ctx.db.insert('productCategoryStatistics', {
			category,
			countUSD: retailPriceUSD > 0 ? 1 : 0,
			countCAD: retailPriceCAD > 0 ? 1 : 0,
			minRetailPriceUSD: retailPriceUSD,
			maxRetailPriceUSD: retailPriceUSD,
			minRetailPriceCAD: retailPriceCAD,
			maxRetailPriceCAD: retailPriceCAD
		});
	}

	// Update existing stat
	await ctx.db.patch(currentStat._id, {
		countUSD: currentStat.countUSD + (retailPriceUSD > 0 ? 1 : 0),
		countCAD: currentStat.countCAD + (retailPriceCAD > 0 ? 1 : 0),
		minRetailPriceUSD:
			retailPriceUSD > 0
				? Math.min(currentStat.minRetailPriceUSD, retailPriceUSD)
				: currentStat.minRetailPriceUSD,
		maxRetailPriceUSD: Math.max(currentStat.maxRetailPriceUSD, retailPriceUSD),
		minRetailPriceCAD:
			retailPriceCAD > 0
				? Math.min(currentStat.minRetailPriceCAD, retailPriceCAD)
				: currentStat.minRetailPriceCAD,
		maxRetailPriceCAD: Math.max(currentStat.maxRetailPriceCAD, retailPriceCAD)
	});
}

async function updateProductCategoryStatistic(
	ctx: MutationCtx,
	category: ProductCategory,
	oldRetailPriceUSD: number = 0,
	oldRetailPriceCAD: number = 0,
	newRetailPriceUSD: number = 0,
	newRetailPriceCAD: number = 0
) {
	const currentStat = await getProductCategoryStatisticByCategory(ctx, category);
	if (!currentStat) return;

	// Calculate count changes
	let countUSDChange = 0;
	let countCADChange = 0;

	if (oldRetailPriceUSD === 0 && newRetailPriceUSD > 0) countUSDChange = 1;
	if (oldRetailPriceUSD > 0 && newRetailPriceUSD === 0) countUSDChange = -1;
	if (oldRetailPriceCAD === 0 && newRetailPriceCAD > 0) countCADChange = 1;
	if (oldRetailPriceCAD > 0 && newRetailPriceCAD === 0) countCADChange = -1;

	await ctx.db.patch(currentStat._id, {
		countUSD: currentStat.countUSD + countUSDChange,
		countCAD: currentStat.countCAD + countCADChange,
		minRetailPriceUSD:
			newRetailPriceUSD > 0
				? Math.min(currentStat.minRetailPriceUSD, newRetailPriceUSD)
				: currentStat.minRetailPriceUSD,
		maxRetailPriceUSD: Math.max(currentStat.maxRetailPriceUSD, newRetailPriceUSD),
		minRetailPriceCAD:
			newRetailPriceCAD > 0
				? Math.min(currentStat.minRetailPriceCAD, newRetailPriceCAD)
				: currentStat.minRetailPriceCAD,
		maxRetailPriceCAD: Math.max(currentStat.maxRetailPriceCAD, newRetailPriceCAD)
	});
}

async function deleteProductCategoryStatistic(
	ctx: MutationCtx,
	category: ProductCategory,
	retailPriceUSD: number = 0,
	retailPriceCAD: number = 0
) {
	const currentStat = await getProductCategoryStatisticByCategory(ctx, category);
	if (!currentStat) return;

	await ctx.db.patch(currentStat._id, {
		countUSD: Math.max(0, currentStat.countUSD - (retailPriceUSD > 0 ? 1 : 0)),
		countCAD: Math.max(0, currentStat.countCAD - (retailPriceCAD > 0 ? 1 : 0))
		// Note: min/max would need recalculation from all products if you want accurate values after delete
	});
}

const productStatisticsModel = {
	getAllProductCategoryStatistic,
	getProductCategoryStatisticByCategory,
	insertProductCategoryStatistic,
	updateProductCategoryStatistic,
	deleteProductCategoryStatistic
};
export default productStatisticsModel;
