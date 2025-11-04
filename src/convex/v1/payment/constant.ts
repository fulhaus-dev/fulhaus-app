import { WorkspacePlan } from './type';

export const stripeSubscriptionPlanPriceId: Record<WorkspacePlan, string> = {
	Creator: process.env.APP_SUB_CREATOR_PLAN_PRICE_ID!,
	Professional: process.env.APP_SUB_PROFESSIONAL_PLAN_PRICE_ID!,
	Teams: process.env.APP_SUB_TEAMS_PLAN_PRICE_ID!,
	Enterprise: process.env.APP_SUB_ENTERPRISE_PLAN_PRICE_ID!,
	Free: ''
};
