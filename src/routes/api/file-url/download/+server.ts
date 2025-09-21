import asyncFetch from '$lib/utils/async-fetch';
import { tryCatch } from '$lib/utils/try-catch.js';
import { error } from '@sveltejs/kit';
import mime from 'mime';

export const GET = async ({ url }) => {
	const targetUrl = url.searchParams.get('url');
	if (!targetUrl) throw error(400, 'URL is required');

	const fileName = url.searchParams.get('name') || 'download';

	const { error: urlError } = tryCatch(() => new URL(targetUrl));
	if (urlError) throw error(urlError.statusCode, urlError.message);

	const { response, error: responseError } = await asyncFetch.get(targetUrl, {
		ignoreContentType: true
	});
	if (responseError) throw error(responseError.statusCode, responseError.message);

	const blob = await response.blob();
	const contentType = response.headers.get('content-type') || 'application/octet-stream';

	const extension = mime.getExtension(contentType) || '';
	const fileNameWithExt = `${fileName}.${extension}`;

	return new Response(blob, {
		status: 200,
		headers: {
			'Content-Type': contentType,
			'Content-Disposition': `attachment; filename="${fileNameWithExt}"`
		}
	});
};
