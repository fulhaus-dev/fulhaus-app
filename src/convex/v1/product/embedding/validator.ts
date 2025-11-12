import { v } from 'convex/values';
import { vProductCategory } from '../validator';

export const vCreateProductEmbeddingFields = {
	categoryUSD: v.optional(vProductCategory),
	categoryCAD: v.optional(vProductCategory),
	retailPriceCAD: v.optional(v.float64()),
	retailPriceUSD: v.optional(v.float64()),
	width: v.optional(v.number()),
	height: v.optional(v.number()),
	depth: v.optional(v.number()),
	weight: v.optional(v.number()),
	imageEmbedding: v.array(v.float64())
};

export const vCreateProductEmbedding = v.object(vCreateProductEmbeddingFields);
