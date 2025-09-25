import { Id } from '../_generated/dataModel';
import { ActionCtx, MutationCtx, QueryCtx } from '../_generated/server';
import ServerError from '../response/error';
import { FunctionName } from '../type';
import chatModel from '../v1/chat/model';
import userPermissionModel from '../v1/user/permission/model';

type AuthorizationCtx = MutationCtx | QueryCtx;

async function userIsAuthenticated(ctx: AuthorizationCtx | ActionCtx) {
	const userIdentity = await ctx.auth.getUserIdentity();
	if (!userIdentity) throw ServerError.Unauthorized();

	return userIdentity?.userId as Id<'users'>;
}

async function userIsWorkspaceMember(ctx: AuthorizationCtx, workspaceId: Id<'workspaces'>) {
	const userId = await userIsAuthenticated(ctx);

	const userIsMemberOfWorkspace = await userPermissionModel.isMemberOfWorkspace(ctx, {
		userId,
		workspaceId
	});
	if (!userIsMemberOfWorkspace)
		throw ServerError.Unauthorized('You are not a member of this workspace.');

	return userId;
}

async function workspaceMemberIsAuthorizedToPerformFunction(
	ctx: MutationCtx | QueryCtx,
	workspaceId: Id<'workspaces'>,
	functionName: FunctionName
) {
	const userId = await userIsAuthenticated(ctx);

	const userIsAuthorizedToPerformFunction = await userPermissionModel.isAuthorizedToPerformFunction(
		ctx,
		functionName,
		{
			userId,
			workspaceId
		}
	);
	if (!userIsAuthorizedToPerformFunction)
		throw ServerError.Unauthorized('You are not a authorized to perform this action.');

	return userId;
}

async function isWorkspaceChat(
	ctx: AuthorizationCtx,
	workspaceId: Id<'workspaces'>,
	chatId: Id<'chats'>
) {
	const chat = await chatModel.getChatById(ctx, chatId);
	if (!chat) throw ServerError.NotFound('Chat not found.');
	if (chat.workspaceId !== workspaceId) throw ServerError.Forbidden('Access denied.');

	return chat;
}

function authorizeProductOnboarding(poApiKey: string) {
	if (poApiKey !== process.env.PRODUCT_ONBOARDING_API_KEY) throw ServerError.Unauthorized();

	return poApiKey;
}

const authorization = {
	userIsAuthenticated,
	userIsWorkspaceMember,
	workspaceMemberIsAuthorizedToPerformFunction,
	isWorkspaceChat,
	authorizeProductOnboarding
};
export default authorization;
