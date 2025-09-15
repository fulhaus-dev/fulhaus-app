import { v, Validator } from 'convex/values';
import { functionNames } from './constant';
import { ISO_4217 } from './iso-code/iso.4217';
import { AiAgentOptions, ToolFnSet } from './type';

export const vFunctionName = v.union(...functionNames.map((name) => v.literal(name)));

export const vCurrencyCode = v.union(...ISO_4217.map((iso) => v.literal(iso.code)));

export const vAiAgentOptions = v.object({}) as Validator<AiAgentOptions>;

export const vAiAgentToolFnSet = v.object({}) as Validator<ToolFnSet>;
