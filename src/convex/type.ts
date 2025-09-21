import { Value } from 'convex/values';
import { functionNames, httpStatusCode } from './constant';
import { ActionCtx } from './_generated/server';
import { Id } from './_generated/dataModel';
import { LanguageModel, StopCondition, ToolSet } from 'ai';

export type HttpStatusCode = (typeof httpStatusCode)[keyof typeof httpStatusCode];

export type ErrorDetails = Record<string, Value>;
export type ErrorData = {
	message: string;
	statusCode: HttpStatusCode;
	details?: ErrorDetails;
};

export type FunctionName = (typeof functionNames)[number];

export type AiToolCtxParams = {
	ctx: ActionCtx;
	workspaceId: Id<'workspaces'>;
	userId: Id<'users'>;
	chatId: Id<'chats'>;
};

export type ToolFnSet = Record<string, (toolCtxParams: AiToolCtxParams) => ToolSet[keyof ToolSet]>;

export type AiAgentOptions = {
	model: LanguageModel;
	systemPromptFileId: Id<'_storage'>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	stopWhen?: StopCondition<any>;
};

export type AgentConfig = {
	options: AiAgentOptions;
	toolFnSet: ToolFnSet;
};
