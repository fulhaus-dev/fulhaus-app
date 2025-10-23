import { v, Validator } from 'convex/values';
import { currencyCodes, functionNames } from './constant';
import { AiAgentOptions, ToolFnSet } from './type';

export const vFunctionName = v.union(...functionNames.map((name) => v.literal(name)));

export const vCurrencyCode = v.union(
	...currencyCodes.map((currencyCode) => v.literal(currencyCode))
);

export const vAiAgentOptions = v.object({}) as Validator<AiAgentOptions>;

export const vAiAgentToolFnSet = v.object({}) as Validator<ToolFnSet>;

export const vFloorPlanFile = v.object({
	url: v.string(),
	mediaType: v.string()
});
