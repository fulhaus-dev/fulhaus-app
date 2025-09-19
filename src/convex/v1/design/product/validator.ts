import { v } from 'convex/values';
import { productCategories } from './category';

export const vProductCategory = v.union(...productCategories.map((tag) => v.literal(tag)));

export const vCreateDesignProduct = v.object({
	workspaceId: v.id('workspaces'),
	projectId: v.id('projects'),
	chatId: v.id('chats'),
	designId: v.id('designs'),
	productId: v.string(),
	name: v.string(),
	imageUrl: v.string(),
	category: vProductCategory
});
