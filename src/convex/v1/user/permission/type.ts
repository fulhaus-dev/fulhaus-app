import { Infer } from 'convex/values';
import { permissionValidator } from './validator';

export type Permission = Infer<typeof permissionValidator>;
