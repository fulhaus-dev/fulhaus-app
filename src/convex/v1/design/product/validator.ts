import { v } from 'convex/values';
import { productCategories } from './category';

export const vProductCategory = v.union(...productCategories.map((tag) => v.literal(tag)));
