import { Infer } from 'convex/values';
import { vPermissionValidator } from './validator';

export type Permission = Infer<typeof vPermissionValidator>;
