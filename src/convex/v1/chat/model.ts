import { Infer } from 'convex/values';
import { Id } from '../../_generated/dataModel';
import { MutationCtx, QueryCtx } from '../../_generated/server';
import date from '../../util/date';
import { vChatMessage, vChatResponseStream, vLlmUsage } from './validator';
import array from '../../util/array';
import userModel from '../user/model';
import designModel from '../design/model';

async function createChat(
	ctx: MutationCtx,
	args: { workspaceId: Id<'workspaces'>; userId: Id<'users'> }
) {
	const { workspaceId, userId } = args;

	return await ctx.db.insert('chats', {
		workspaceId,
		createdById: userId,
		createdAt: date.now()
	});
}

async function saveChatMessage(
	ctx: MutationCtx,
	args: {
		workspaceId: Id<'workspaces'>;
		userId: Id<'users'>;
		chatId: Id<'chats'>;
		message: Infer<typeof vChatMessage>;
		usage?: Infer<typeof vLlmUsage>;
	}
) {
	const { userId, ...otherArgs } = args;

	return await ctx.db.insert('chatMessages', {
		...otherArgs,
		createdById: userId,
		createdAt: date.now()
	});
}

async function saveChatResponseStream(
	ctx: MutationCtx,
	args: {
		workspaceId: Id<'workspaces'>;
		chatId: Id<'chats'>;
		stream: Infer<typeof vChatResponseStream>;
	}
) {
	return await ctx.db.insert('chatResponseStreams', args);
}

async function getChatById(ctx: QueryCtx, chatId: Id<'chats'>) {
	return await ctx.db.get(chatId);
}

async function getChatMessages(
	ctx: QueryCtx,
	args: {
		workspaceId: Id<'workspaces'>;
		chatId: Id<'chats'>;
	}
) {
	return await ctx.db
		.query('chatMessages')
		.withIndex('workspace_chat_message', (q) =>
			q.eq('workspaceId', args.workspaceId).eq('chatId', args.chatId)
		)
		.collect();
}

async function getChatMessageHistory(
	ctx: QueryCtx,
	args: {
		workspaceId: Id<'workspaces'>;
		chatId: Id<'chats'>;
	}
) {
	const chatMessages = await getChatMessages(ctx, args);

	const chatUsers = await Promise.all(
		array
			.getUniqueListBy(chatMessages, 'createdById')
			.map((chatMessage) => userModel.getUserById(ctx, chatMessage.createdById))
	);

	const chatUsersMetadata = chatUsers
		.filter((user) => !!user)
		.map((user) => ({
			userId: user._id as string,
			fullName: user.fullName!,
			imageUrl: user.imageUrl
		}));

	const chatHistory = chatMessages.map((chatMessage) => ({
		id: chatMessage._id,
		message: chatMessage.message,
		userId: chatMessage.createdById,
		createdAt: chatMessage.createdAt
	}));

	return {
		messages: chatHistory,
		usersMetadata: chatUsersMetadata
	};
}

async function getChatResponseStreams(
	ctx: QueryCtx,
	args: { workspaceId: Id<'workspaces'>; chatId: Id<'chats'> }
) {
	const chatResponseStreams = await ctx.db
		.query('chatResponseStreams')
		.withIndex('workspace_chat_response_stream', (q) =>
			q.eq('workspaceId', args.workspaceId).eq('chatId', args.chatId)
		)
		.collect();

	return chatResponseStreams.map((chatResponseStream) => ({
		_id: chatResponseStream._id,
		stream: chatResponseStream.stream
	}));
}

async function deleteChatResponseStreams(
	ctx: MutationCtx,
	args: { workspaceId: Id<'workspaces'>; chatId: Id<'chats'> }
) {
	const chatResponseStreams = await getChatResponseStreams(ctx, args);

	await Promise.all(
		chatResponseStreams.map((chatResponseStream) => ctx.db.delete(chatResponseStream._id))
	);
}

async function updateChatById(
	ctx: MutationCtx,
	chatId: Id<'chats'>,
	args: {
		designId?: Id<'designs'>;
	}
) {
	return await ctx.db.patch(chatId, args);
}

async function getChatContext(
	ctx: QueryCtx,
	args: {
		workspaceId: Id<'workspaces'>;
		chatId: Id<'chats'>;
		floorPlanUrl?: string;
	}
) {
	const { workspaceId, chatId, floorPlanUrl } = args;

	const [chat, chatMessages] = await Promise.all([
		getChatById(ctx, chatId),
		getChatMessages(ctx, {
			workspaceId,
			chatId
		})
	]);

	const chatDesignId = chat?.designId;

	const contextParts = [];

	const [currentChatDesign, existingDesignsWithFloorPlanUrl] = await Promise.all([
		chatDesignId ? designModel.getDesignById(ctx, chatDesignId) : Promise.resolve(null),
		floorPlanUrl
			? designModel.getExistingDesignsWithFloorPlanUrl(ctx, floorPlanUrl)
			: Promise.resolve([])
	]);

	if (currentChatDesign) {
		contextParts.push(`**Current Design ID:** ${currentChatDesign._id}\n`);
		contextParts.push(`**Current Design Name:** ${currentChatDesign.name}\n`);
		contextParts.push(`**Current Design Description:** ${currentChatDesign.description}\n`);
		contextParts.push(`**Current Design Space Type:** ${currentChatDesign.spaceType}\n`);
		contextParts.push(
			`**Current Design Inspiration Image URL:** ${currentChatDesign.inspirationImageUrl}\n`
		);
		contextParts.push(
			`**Current Design Product Categories:** ${currentChatDesign.productCategories.map((category) => category).join(', ')}\n\n`
		);
	}

	if (existingDesignsWithFloorPlanUrl.length > 0) {
		contextParts.push(`**Existing Designs and spaces using the same Floor Plan:**\n\n`);
		for (const [index, design] of existingDesignsWithFloorPlanUrl.entries()) {
			contextParts.push(`**${index}:**\n`);
			contextParts.push(`**Design Name:** ${design.name}\n`);
			contextParts.push(`**Design Space Type:** ${design.spaceType}\n\n`);
		}
	}

	return {
		chatMessages,
		chatDesignContext: contextParts.join('')
	};
}

const chatModel = {
	createChat,
	saveChatMessage,
	saveChatResponseStream,
	getChatById,
	getChatMessages,
	getChatMessageHistory,
	getChatResponseStreams,
	deleteChatResponseStreams,
	updateChatById,
	getChatContext
};
export default chatModel;
