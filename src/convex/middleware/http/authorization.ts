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

const httpAuthorization = {
	apiKey,
	workspaceMemberIsAuthorizedToPerformFunction
};
export default httpAuthorization;
