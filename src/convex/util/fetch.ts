import { ErrorData, HttpStatusCode } from '../type';
import error from './error';

type CustomAsyncFetchOptions = { ignoreContentType?: boolean };

export type AsyncFetchOptions = Omit<RequestInit, 'method'> & CustomAsyncFetchOptions;
type AsyncFetchRequestInit = RequestInit & CustomAsyncFetchOptions;

type AsyncFetchResponse =
	| {
			response: Response;
			error?: undefined;
	  }
	| {
			response?: undefined;
			error: ErrorData;
	  };

async function executeFetch(
	path: string,
	options: AsyncFetchRequestInit
): Promise<AsyncFetchResponse> {
	const headers = (options?.headers ?? {}) as Record<string, string>;
	if (!options?.ignoreContentType && options.method !== 'HEAD')
		headers['Content-Type'] = 'application/json';

	try {
		const response = await fetch(path, {
			...options,
			headers
		});

		if (!response.ok)
			return {
				error: {
					statusCode: response.status as HttpStatusCode,
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
	head: (path: string, options: AsyncFetchOptions = {}) =>
		executeFetch(path, { ...options, method: 'HEAD' }),
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
