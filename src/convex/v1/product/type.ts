import { Infer } from 'convex/values';
import { productCategories } from './constant';
import { vClientProduct } from './validator';
import { Doc } from '../../_generated/dataModel';

export type ProductCategory = (typeof productCategories)[number];
export type Product = Doc<'products'>;
export type ClientProduct = Infer<typeof vClientProduct>;
