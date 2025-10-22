import { defineTable } from 'convex/server';
import { v } from 'convex/values';
import { vProductCategory } from '../validator';

export const productCategoryStatisticTable = defineTable({
	category: vProductCategory,
	countUSD: v.number(),
	countCAD: v.number(),
	minRetailPriceUSD: v.float64(),
	maxRetailPriceUSD: v.float64(),
	minRetailPriceCAD: v.float64(),
	maxRetailPriceCAD: v.float64()
}).index('by_category', ['category']);
