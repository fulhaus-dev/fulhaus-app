import { Infer } from 'convex/values';
import { productCategories } from './constant';
import { vClientProduct, vProductStyle } from './validator';
import { Doc } from '../../_generated/dataModel';

export type ProductCategory = (typeof productCategories)[number];
export type ProductStyle = Infer<typeof vProductStyle>;
export type Product = Doc<'products'>;
export type ClientProduct = Infer<typeof vClientProduct>;
