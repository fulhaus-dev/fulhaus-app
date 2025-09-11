import { Infer } from 'convex/values';
import { updateUserValidator } from './validator';

export type UpdateUser = Infer<typeof updateUserValidator>;
