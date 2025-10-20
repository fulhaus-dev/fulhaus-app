import { Infer } from 'convex/values';
import { spaceTypes } from './constant';
import { vDesignProductCategory, vUpdateDesign } from './validator';

export type SpaceType = (typeof spaceTypes)[number];
export type DesignProductCategory = Infer<typeof vDesignProductCategory>;
export type UpdateDesign = Infer<typeof vUpdateDesign>;

export type UniqueSpace = {
	spaceType: SpaceType;
	imageUrl: string;
};
