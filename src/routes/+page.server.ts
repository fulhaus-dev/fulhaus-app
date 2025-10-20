import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
	throw redirect(303, `/${locals.activeWorkspaceId}/ludwig`);
}
