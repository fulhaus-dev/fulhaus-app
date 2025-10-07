import { Infer } from 'convex/values';
import { spaceTypes } from './constant';
import { vUpdateDesign } from './validator';

export type SpaceType = (typeof spaceTypes)[number];
export type UpdateDesign = Infer<typeof vUpdateDesign>;

export type UniqueSpace = {
	spaceType: SpaceType;
	imageUrl: string;
};
