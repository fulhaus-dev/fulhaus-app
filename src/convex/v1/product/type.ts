import { Infer } from 'convex/values';
import { productCategories } from './constant';
import {
	vClientProduct,
	vProductFilter,
	vProductStyle,
	vProductSortOptions,
	vProductPaginationOptions,
	vProductRecommendationFilter
} from './validator';
import { Doc } from '../../_generated/dataModel';

export type ProductCategory = (typeof productCategories)[number];
export type ProductStyle = Infer<typeof vProductStyle>;
export type Product = Doc<'products'>;
export type ClientProduct = Infer<typeof vClientProduct>;
export type ProductFilter = Infer<typeof vProductFilter>;
export type ProductSortOptions = Infer<typeof vProductSortOptions>;
export type ProductPaginationOptions = Infer<typeof vProductPaginationOptions>;
export type ProductRecommendationFilter = Infer<typeof vProductRecommendationFilter>;
