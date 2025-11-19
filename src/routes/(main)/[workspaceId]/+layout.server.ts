import { QueryParams } from '$lib/enums';
import { error, redirect } from '@sveltejs/kit';

export const load = ({ locals, url, params }) => {
	const activeWorkspaceId = locals.activeWorkspaceId;
	const href = url.href;
	const currentWorkspaceId = params.workspaceId;

	if (!activeWorkspaceId)
		throw redirect(303, `/auth?${QueryParams.AUTH_REDIRECT_URL}=${encodeURIComponent(href)}`);

	if (activeWorkspaceId === 'undefined')
		throw error(404, 'The workspace you are trying to access does not exist.');

	if (currentWorkspaceId !== activeWorkspaceId)
		throw redirect(303, href.replace(currentWorkspaceId, activeWorkspaceId));
};
