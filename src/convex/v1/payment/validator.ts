import { v } from 'convex/values';
import { vCurrencyCode } from '../../validator';
import { vWorkspacePlan } from '../workspace/plan/validator';

export const vPaymentType = v.union(v.literal('cart'), v.literal('credits'));

export const vPaymentMetadata = v.object({
	workspaceId: v.id('workspaces'),
	userId: v.id('users'),
	currencyCode: vCurrencyCode,
	plan: vWorkspacePlan,
	credit: v.optional(v.string()),
	type: vPaymentType
});
