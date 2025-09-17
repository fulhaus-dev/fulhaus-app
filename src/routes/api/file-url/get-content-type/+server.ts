import asyncFetch from '$lib/utils/async-fetch';
import { tryCatch } from '$lib/utils/try-catch.js';
import { error } from '@sveltejs/kit';

export const GET = async ({ url }) => {
	const targetUrl = url.searchParams.get('url');
	if (!targetUrl) throw error(400, 'URL is required');

	const { error: urlError } = tryCatch(() => new URL(targetUrl));
	if (urlError) throw error(urlError.statusCode, urlError.message);

	const { response, error: responseError } = await asyncFetch.head(targetUrl);
	if (responseError) throw error(responseError.statusCode, responseError.message);

	const contentType = response.headers.get('content-type');
	const mediaType = contentType ? contentType.split(';')[0].trim() : null;

	return new Response(JSON.stringify({ mediaType }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' }
	});
};
