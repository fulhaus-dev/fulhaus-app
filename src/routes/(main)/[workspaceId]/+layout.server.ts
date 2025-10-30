import { QueryParams } from '$lib/enums';
import { error, redirect } from '@sveltejs/kit';

export const load = ({ locals, url, params }) => {
	const activeWorkspaceId = locals.activeWorkspaceId;
	const pathname = url.pathname;
	const currentWorkspaceId = params.workspaceId;
	const pathnameWithoutWorkspaceId = pathname.replace(`/${currentWorkspaceId}`, '');

	if (!activeWorkspaceId)
		throw redirect(303, `/auth?${QueryParams.AUTH_REDIRECT_URL}=${encodeURIComponent(pathname)}`);

	if (activeWorkspaceId === 'undefined')
		throw error(404, 'The workspace you are trying to access does not exist.');

	if (currentWorkspaceId === 'undefined')
		throw redirect(303, `/${activeWorkspaceId}${pathnameWithoutWorkspaceId}`);
};
