import { v } from 'convex/values';
import { vCurrencyCode } from '../../validator';

export const vUpdateWorkspace = v.object({
	name: v.optional(v.string()),
	logoUrl: v.optional(v.string()),
	members: v.optional(v.array(v.id('users'))),
	currencyCodes: v.optional(v.array(vCurrencyCode))
});
