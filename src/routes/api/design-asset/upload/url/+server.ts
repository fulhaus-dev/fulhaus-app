import { error } from '@sveltejs/kit';
import { CONVEX_HTTP_REQ_API_KEY, CONVEX_HTTP_URL } from '$env/static/private';
import asyncFetch from '$lib/utils/async-fetch';
import { getAuthParams } from '$lib/server/authenticate';

export const POST = async ({ cookies, request }) => {
	const { authToken, activeWorkspaceId } = getAuthParams(cookies);

	if (!authToken) throw error(401, 'Unauthorized!');
	if (!activeWorkspaceId) throw error(404, 'No workspace id found');

	const { url: assetUrl, type } = await request.json();

	const { response: assetBlobResponse, error: getAssetBlobError } = await asyncFetch.get(assetUrl);
	if (getAssetBlobError) throw error(getAssetBlobError.statusCode, getAssetBlobError.message);

	const assetBlob = await assetBlobResponse.blob();
	if (!(assetBlob instanceof Blob)) throw error(400, 'Could not get file from url');

	const pathname = new URL(assetUrl).pathname;
	const fileExt = pathname.split('/').pop() || '';
	const fileName = pathname.split('/').pop() ?? `${Date.now()}.${fileExt}`;

	const { response, error: uploadError } = await asyncFetch.post(
		`${CONVEX_HTTP_URL}/workspace/upload-asset`,
		{
			headers: {
				Authorization: `Bearer ${authToken}`,
				'x-api-key': CONVEX_HTTP_REQ_API_KEY,
				'x-api-workspace-id': activeWorkspaceId,
				'x-asset-type': type,
				'x-asset-name': fileName,
				'Content-Type': assetBlob.type || 'application/octet-stream',
				'Content-Disposition': `attachment; filename="${encodeURIComponent(fileName)}"`
			},
			body: assetBlob,
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
