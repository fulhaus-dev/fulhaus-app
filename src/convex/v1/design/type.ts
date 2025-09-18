import { productCategories } from './product/category';
import { spaceTypes } from './space';

export type SpaceType = (typeof spaceTypes)[number];
export type ProductCategory = (typeof productCategories)[number];
