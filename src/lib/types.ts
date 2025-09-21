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

export type ChatMessageContent = Doc<'chatMessages'>['message']['content'];

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

export type DesignAssetFileType = Doc<'workspaceAssets'>['type'];

export type LudwigProjectDetails = {
	_id: Id<'projects'>;
	name: string;
	description: string;
};

export type LudwigDesignDetails = {
	_id: Id<'designs'>;
	chatId: Id<'chats'>;
	name: string;
	description: string;
	spaceType: Doc<'designs'>['spaceType'];
	inspirationImageUrl: string;
	floorPlanFile?: FloorPlanFile;
	productCategories: Doc<'designs'>['productCategories'];
	publishedAt?: number;
};

export type LudwigDesignDetailsResponse = {
	projectDetails?: LudwigProjectDetails;
	designDetails?: LudwigDesignDetails;
};

export type UpdateProject = {
	name?: string;
	description?: string;
	summary?: string;
};

export type SpaceType = Doc<'designs'>['spaceType'];
export type ProductCategories = Doc<'designs'>['productCategories'];

export type FloorPlanFile = Doc<'designs'>['floorPlanFile'];

export type UpdateDesign = {
	name?: string;
	description?: string;
	inspirationImageUrl?: string;
	floorPlanFileUrl?: string;
	floorPlanFile?: FloorPlanFile;
	productCategories?: ProductCategories;
};
