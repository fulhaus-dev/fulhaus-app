import { v } from 'convex/values';
import { USER_PERMISSION_VALUES } from './constant';

export const permissionValidator = v.union(
	...USER_PERMISSION_VALUES.map((permissionValue) => v.literal(permissionValue))
);
