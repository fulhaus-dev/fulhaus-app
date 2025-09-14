import error from './error';

export function tryCatch<T>(fn: () => T) {
	try {
		const data = fn();
		return { data };
	} catch (unknownError) {
		const errorRecord = error.exceptionError(unknownError);
		return { error: errorRecord };
	}
}

export async function asyncTryCatch<T>(asyncFn: () => Promise<T>) {
	try {
		const data = await asyncFn();
		return { data };
	} catch (unknownError) {
		const errorRecord = error.exceptionError(unknownError);
		return { error: errorRecord };
	}
}
