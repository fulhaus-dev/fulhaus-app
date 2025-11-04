import { Infer } from 'convex/values';
import { vWorkspacePlan } from '../workspace/plan/validator';

export type PaymentType = 'cart' | 'credits';

export type WorkspacePlan = Infer<typeof vWorkspacePlan>;

export type PaymentMetadata = {
	workspaceId: string;
	userId: string;
	currencyCode: string;
	plan?: WorkspacePlan;
	type: PaymentType;
};
