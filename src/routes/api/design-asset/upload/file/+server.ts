import { error } from '@sveltejs/kit';
import { CONVEX_HTTP_REQ_API_KEY, CONVEX_HTTP_URL } from '$env/static/private';
import asyncFetch from '$lib/utils/async-fetch';
import { getAuthParams } from '$lib/server/authenticate';

export const config = {
    bodySizeLimit: '10mb'
};

export const POST = async ({ cookies, request }) => {
	const { authToken, activeWorkspaceId } = getAuthParams(cookies);

	if (!authToken) throw error(401, 'Unauthorized!');
	if (!activeWorkspaceId) throw error(404, 'No workspace id found');

	const formData = await request.formData();

	const file = formData.get('file');
	const type = formData.get('type') as string;

	if (!(file instanceof File) || !type) throw error(400, 'File or type missing');

	const { response, error: uploadError } = await asyncFetch.post(
		`${CONVEX_HTTP_URL}/workspace/upload-asset`,
		{
			headers: {
				Authorization: `Bearer ${authToken}`,
				'x-api-key': CONVEX_HTTP_REQ_API_KEY,
				'x-api-workspace-id': activeWorkspaceId,
				'x-asset-type': type,
				'x-asset-name': file.name,
				'Content-Type': file.type || 'application/octet-stream',
				'Content-Disposition': `attachment; filename="${encodeURIComponent(file.name)}"`
			},
			body: file,
			ignoreContentType: true
		}
	);

	if (uploadError) throw error(uploadError.statusCode, uploadError.message);

	const data = await response.json();

	return new Response(JSON.stringify(data), {
		status: 200,
		headers: { 'Content-Type': 'application/json' }
	});
};
