import { Id } from '../../../../_generated/dataModel';
import { httpAction } from '../../../../_generated/server';
import httpAuthorization from '../../../../middleware/http/authorization';
import ServerError from '../../../../response/error';

export const uploadWorkspaceAsset = httpAction(async (ctx, request) => {
	const apiKey = request.headers.get('x-api-key') ?? undefined;
	httpAuthorization.apiKey(apiKey);

	const workspaceId = (request.headers.get('x-api-workspace-id') ?? undefined) as
		| Id<'workspaces'>
		| undefined;
	if (!workspaceId) throw ServerError.BadRequest('Workspace ID not found.');

	await httpAuthorization.workspaceMemberIsAuthorizedToPerformFunction(
		ctx,
		workspaceId,
		'createDesign'
	);

	const blob = await request.blob();

	console.log(blob);

	return new Response();
});
