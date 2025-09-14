import { ConvexError } from 'convex/values';
import { ErrorData, ErrorDetails, HttpStatusCode } from '../type';
import { httpStatusCode } from '../constant';

export default class ServerError extends ConvexError<ErrorData> {
	public readonly statusCode: HttpStatusCode;
	public readonly isOperational: boolean;
	public readonly details?: ErrorDetails;

	constructor(
		message = 'Unknown Error',
		statusCode: HttpStatusCode = httpStatusCode.INTERNAL_SERVER_ERROR,
		details?: ErrorDetails,
		isOperational = true
	) {
		super({ message, statusCode, details });
		this.statusCode = statusCode;
		this.isOperational = isOperational;
		this.details = details;

		// Error.captureStackTrace is a V8-specific API.
		// It's good for Node.js environments, but might not be available in all JS runtimes.
		if (typeof Error.captureStackTrace === 'function')
			Error.captureStackTrace(this, this.constructor);
	}

	static BadRequest(message = 'Bad request.', details?: ErrorDetails) {
		return new ServerError(message, httpStatusCode.BAD_REQUEST, details);
	}

	static Unauthorized(message = 'Unauthorized!', details?: ErrorDetails) {
		return new ServerError(message, httpStatusCode.UNAUTHORIZED, details);
	}

	static PaymentRequired(message = 'Payment Required.', details?: ErrorDetails) {
		return new ServerError(message, httpStatusCode.PAYMENT_REQUIRED, details);
	}

	static Forbidden(message = 'Forbidden.', details?: ErrorDetails) {
		return new ServerError(message, httpStatusCode.FORBIDDEN, details);
	}

	static NotFound(message = 'Not found.', details?: ErrorDetails) {
		return new ServerError(message, httpStatusCode.NOT_FOUND, details);
	}

	static TooManyRequests(message = 'Too many requests.', details?: ErrorDetails) {
		return new ServerError(message, httpStatusCode.TOO_MANY_REQUESTS, details);
	}

	static InternalServerError(message = 'Internal server error.', details?: ErrorDetails) {
		return new ServerError(message, httpStatusCode.INTERNAL_SERVER_ERROR, details);
	}

	static ServiceUnavailable(message = 'Service unavailable.', details?: ErrorDetails) {
		return new ServerError(message, httpStatusCode.SERVICE_UNAVAILABLE, details);
	}
}

function exceptionError(error: unknown) {
	const errorResponse: ErrorData = {
		statusCode: httpStatusCode.INTERNAL_SERVER_ERROR,
		message: 'An unknown error occurred'
	};

	// Check if the error is an instance of Error
	if (error instanceof Error) errorResponse.message = error.message;

	return errorResponse;
}

export const error = {
	exceptionError
};
