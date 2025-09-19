import { ProductCategory } from '../design/type';

type LudwigRecommendationResponseData = {
	id: string;
	name: string;
	url: string;
	category: ProductCategory;
};

export type LudwigRecommendationResponse = {
	recommendations: {
		data: LudwigRecommendationResponseData[];
		state: number;
	};
};
