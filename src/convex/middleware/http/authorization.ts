import { internal } from '../../_generated/api';
import { Id } from '../../_generated/dataModel';
import { ActionCtx } from '../../_generated/server';
import ServerError from '../../response/error';
import { FunctionName } from '../../type';
import authorization from '../authorization';

async function apiKey(apiKey?: string) {
	if (!apiKey) throw ServerError.Unauthorized();
	if (process.env.HTTP_REQ_API_KEY !== apiKey) throw ServerError.Unauthorized();
}

async function workspaceMemberIsAuthorizedToPerformFunction(
	ctx: ActionCtx,
	workspaceId: Id<'workspaces'>,
	functionName: FunctionName
) {
	const userId = await authorization.userIsAuthenticated(ctx);

	const userIsAuthorizedToPerformFunction = await ctx.runQuery(
		internal.middleware.internal.query.workspaceMemberIsAuthorizedToPerformFunction,
		{
			userId,
			workspaceId,
			functionName
		}
	);

	if (!userIsAuthorizedToPerformFunction)
		throw ServerError.Unauthorized('You are not a authorized to perform this action.');

	return userId;
}

async function isWorkspaceChat(ctx: ActionCtx, workspaceId: Id<'workspaces'>, chatId: Id<'chats'>) {
	const chat = await ctx.runQuery(internal.v1.chat.internal.query.getChatById, { chatId });
	if (!chat) throw ServerError.NotFound('Chat not found.');
	if (chat.workspaceId !== workspaceId) throw ServerError.Forbidden('Access denied.');

	return chat;
}

const httpAuthorization = {
	apiKey,
	workspaceMemberIsAuthorizedToPerformFunction,
	isWorkspaceChat
};
export default httpAuthorization;
