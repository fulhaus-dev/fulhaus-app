import { Value } from 'convex/values';
import { functionNames, httpStatusCode, productCategories, spaceTypes } from './constant';
import { ActionCtx } from './_generated/server';
import { Id } from './_generated/dataModel';
import { LanguageModel, ToolSet } from 'ai';

export type HttpStatusCode = (typeof httpStatusCode)[keyof typeof httpStatusCode];

export type ErrorDetails = Record<string, Value>;
export type ErrorData = {
	message: string;
	statusCode: HttpStatusCode;
	details?: ErrorDetails;
};

export type FunctionName = (typeof functionNames)[number];

export type SpaceType = (typeof spaceTypes)[number];
export type ProductCategory = (typeof productCategories)[number];

export type AiToolCtxParams = {
	ctx: ActionCtx;
	workspaceId: Id<'workspaces'>;
	userId: Id<'users'>;
	chatId: Id<'chats'>;
};

export type ToolFnSet = Record<string, (toolCtxParams: AiToolCtxParams) => ToolSet[keyof ToolSet]>;

export type AiAgentOptions = {
	model: LanguageModel;
	system: string;
};
