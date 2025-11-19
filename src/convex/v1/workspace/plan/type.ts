import { Infer } from 'convex/values';
import { vUpdateWorkspacePlan, vWorkspacePlan } from './validator';

export type WorkspacePlan = Infer<typeof vWorkspacePlan>;

export type UpdateWorkspacePlan = Infer<typeof vUpdateWorkspacePlan>;
