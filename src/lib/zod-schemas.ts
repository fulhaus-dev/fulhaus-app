import { productCategories } from '$lib/constants';
import z from 'zod';

const zCategory = z.enum(productCategories);
const zAvailability = z.enum(['In Stock', 'Low Stock', 'Out of Stock']);

export const zProductFilter = z
	.object({
		category: z.optional(zCategory),
		name: z.optional(z.string()),
		availability: z.optional(zAvailability),
		minPrice: z.optional(z.coerce.number()),
		maxPrice: z.optional(z.coerce.number()),
		minWidth: z.optional(z.coerce.number()),
		maxWidth: z.optional(z.coerce.number()),
		minHeight: z.optional(z.coerce.number()),
		maxHeight: z.optional(z.coerce.number()),
		minDepth: z.optional(z.coerce.number()),
		maxDepth: z.optional(z.coerce.number()),
		minWeight: z.optional(z.coerce.number()),
		maxWeight: z.optional(z.coerce.number()),
		brand: z.optional(z.string())
	})
	.strip();

export const zProductSortIndex = z.enum(['by_category_price', 'by_price']);
export const zProductSortOrder = z.enum(['asc', 'desc']);

export const zProductSortOptions = z
	.object({
		index: zProductSortIndex,
		order: zProductSortOrder
	})
	.strip();
