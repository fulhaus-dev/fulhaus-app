import { SpaceType } from '../type';
import { spaceTypeProductCategories } from './constant';

function getProductCategoriesForSpace(spaceType: SpaceType) {
	return spaceTypeProductCategories[spaceType];
}

const designProductModel = {
	getProductCategoriesForSpace
};
export default designProductModel;
