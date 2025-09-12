import type { Value } from 'convex/values';
import type { Doc, Id } from '../convex/_generated/dataModel';

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

export type ImageData = {
	id: string;
	description?: string;
	url: string;
};

export type ChatMessage = Doc<'chatMessages'>['message'];

export type ChatMessageDoc = {
	id: Id<'chatMessages'>;
	message: ChatMessage;
	userId: Id<'users'>;
	createdAt: number;
};

export type ChatUser = {
	userId: string;
	fullName: string;
	imageUrl?: string;
};
