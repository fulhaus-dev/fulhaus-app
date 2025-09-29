import { productCategories } from '$lib/constants';
import z from 'zod';

const zCategory = z.enum(productCategories);

export const zProductFilter = z
	.object({
		category: z.optional(zCategory),
		name: z.optional(z.string()),
		brand: z.optional(z.string()),
		minWidth: z.optional(z.coerce.number()),
		maxWidth: z.optional(z.coerce.number()),
		minHeight: z.optional(z.coerce.number()),
		maxHeight: z.optional(z.coerce.number()),
		minDepth: z.optional(z.coerce.number()),
		maxDepth: z.optional(z.coerce.number()),
		minWeight: z.optional(z.coerce.number()),
		maxWeight: z.optional(z.coerce.number()),
		minRetailPrice: z.optional(z.coerce.number()),
		maxRetailPrice: z.optional(z.coerce.number()),
		minStock: z.optional(z.coerce.number()),
		maxStock: z.optional(z.coerce.number())
	})
	.strip();
