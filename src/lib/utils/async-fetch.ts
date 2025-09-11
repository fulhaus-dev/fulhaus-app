import type { ErrorRecord } from '$lib/types';
import error from '$lib/utils/error';

export type AsyncFetchOptions = Omit<RequestInit, 'method'> & { ignoreContentType?: boolean };
type AsyncFetchRequestInit = RequestInit & { ignoreContentType?: boolean };

type AsyncFetchResponse =
	| {
			response: Response;
			error?: undefined;
	  }
	| {
			response?: undefined;
			error: ErrorRecord;
	  };

async function executeFetch(
	path: string,
	options?: AsyncFetchRequestInit
): Promise<AsyncFetchResponse> {
	const headers = (options?.headers ?? {}) as Record<string, string>;
	if (!options?.ignoreContentType) headers['Content-Type'] = 'application/json';

	try {
		const response = await fetch(path, {
			...options,
			headers
		});

		if (!response.ok)
			return {
				error: {
					statusCode: response.status,
					message: response.statusText
				}
			};

		return {
			response
		};
	} catch (unknownError) {
		const errorResponse = error.exceptionError(unknownError);

		return {
			error: {
				statusCode: errorResponse.statusCode,
				message: errorResponse.message
			}
		};
	}
}

const asyncFetch = {
	get: (path: string, options: AsyncFetchOptions = {}) =>
		executeFetch(path, { ...options, method: 'GET' }),
	post: (path: string, options: AsyncFetchOptions = {}) =>
		executeFetch(path, { ...options, method: 'POST' }),
	patch: (path: string, options: AsyncFetchOptions = {}) =>
		executeFetch(path, { ...options, method: 'PATCH' }),
	delete: (path: string, options: AsyncFetchOptions = {}) =>
		executeFetch(path, { ...options, method: 'DELETE' })
};
export default asyncFetch;
