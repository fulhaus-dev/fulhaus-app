import { v } from 'convex/values';
import { functionNames } from './constant';

export const vFunctionName = v.union(...functionNames.map((name) => v.literal(name)));
