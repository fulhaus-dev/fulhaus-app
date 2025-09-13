import { Value } from 'convex/values';
import { functionNames, httpStatusCode } from './constant';

export type HttpStatusCode = (typeof httpStatusCode)[keyof typeof httpStatusCode];

export type ErrorDetails = Record<string, Value>;
export type ErrorData = {
	message: string;
	statusCode: HttpStatusCode;
	details?: ErrorDetails;
};

export type FunctionName = (typeof functionNames)[number];
