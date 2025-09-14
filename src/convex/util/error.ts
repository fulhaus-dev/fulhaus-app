import { ConvexError } from 'convex/values';
import type z from 'zod';
import { ErrorData } from '../type';

function exceptionError(error: unknown) {
	const errorResponse: ErrorData = { statusCode: 500, message: 'An unknown error occurred' };

	if (error instanceof ConvexError) {
		errorResponse.message = error.data.message;
		errorResponse.statusCode = error.data.statusCode;
		errorResponse.details = error.data.details;
	}

	// Check if the error is an instance of Error
	if (error instanceof Error) errorResponse.message = error.message;

	return errorResponse;
}

export function zodErrorMessage<T>(schema: z.ZodSchema<T>, data: unknown) {
	const parsedData = schema.safeParse(data);

	if (!parsedData.error) return;

	return parsedData.error.issues.map((issue) => issue.message).join(', ');
}

const error = {
	exceptionError,
	zodErrorMessage
};
export default error;
