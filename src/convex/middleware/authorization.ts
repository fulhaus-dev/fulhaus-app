import { Id } from '../_generated/dataModel';
import { ActionCtx, MutationCtx, QueryCtx } from '../_generated/server';
import ServerError from '../response/error';
import { FunctionName } from '../type';
import chatModel from '../v1/chat/model';
import userPermissionModel from '../v1/user/permission/model';
import workspacePlanModel from '../v1/workspace/plan/model';

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

async function hasRoomCredits(ctx: AuthorizationCtx, workspaceId: Id<'workspaces'>) {
	const workspacePlan = await workspacePlanModel.getWorkspacePlanByWorkspaceId(ctx, workspaceId);
	if (!workspacePlan)
		throw ServerError.Unauthorized('You have no more credits to perform this action.');

	const availableCredits = workspacePlan.credit - workspacePlan.used;
	if (availableCredits < 200)
		throw ServerError.Unauthorized('You have no more credits to perform this action.');

	return workspacePlan;
}

async function hasRenderCredits(ctx: AuthorizationCtx, workspaceId: Id<'workspaces'>) {
	const workspacePlan = await workspacePlanModel.getWorkspacePlanByWorkspaceId(ctx, workspaceId);
	if (!workspacePlan)
		throw ServerError.Unauthorized('You have no more credits to perform this action.');

	const availableCredits = workspacePlan.credit - workspacePlan.used;
	if (availableCredits < 100)
		throw ServerError.Unauthorized('You have no more credits to perform this action.');

	return workspacePlan;
}

const authorization = {
	userIsAuthenticated,
	userIsWorkspaceMember,
	workspaceMemberIsAuthorizedToPerformFunction,
	isWorkspaceChat,
	authorizeProductOnboarding,
	hasRoomCredits,
	hasRenderCredits
};
export default authorization;
