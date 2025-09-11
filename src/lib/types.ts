import type { Value } from 'convex/values';
import type { Id } from '../convex/_generated/dataModel';

type ErrorDetails = Record<string, Value>;

export type ErrorRecord = {
	statusCode: number;
	message: string;
	details?: ErrorDetails;
};

export type UserProfile = {
	_id: Id<'users'>;
	email: string;
	firstName?: string;
	lastName?: string;
	fullName?: string;
	imageUrl?: string;
	phone?: string;
	currentWorkspaceId?: Id<'workspaces'>;
};
