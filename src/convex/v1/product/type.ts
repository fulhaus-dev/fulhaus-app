import { Infer } from 'convex/values';
import { productCategories } from './constant';
import { vClientProduct } from './validator';

export type ProductCategory = (typeof productCategories)[number];
export type ClientProduct = Infer<typeof vClientProduct>;
