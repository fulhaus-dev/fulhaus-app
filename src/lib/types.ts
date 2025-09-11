import type { Value } from 'convex/values';

type ErrorDetails = Record<string, Value>;

export type ErrorRecord = {
	statusCode: number;
	message: string;
	details?: ErrorDetails;
};
