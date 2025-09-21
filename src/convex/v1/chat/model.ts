import { Infer } from 'convex/values';
import { Id } from '../../_generated/dataModel';
import { MutationCtx, QueryCtx } from '../../_generated/server';
import date from '../../util/date';
import { vChatMessage, vChatResponseStream, vLlmUsage } from './validator';
import array from '../../util/array';
import userModel from '../user/model';
import projectModel from '../project/model';
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
		projectId?: Id<'projects'>;
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
	}
) {
	const { workspaceId, chatId } = args;

	const [chat, chatMessages] = await Promise.all([
		getChatById(ctx, chatId),
		getChatMessages(ctx, {
			workspaceId,
			chatId
		})
	]);

	const chatProjectId = chat?.projectId;
	const chatDesignId = chat?.designId;

	const contextParts = [];

	const [chatProject, chatProjectDesigns, currentChatDesign] = await Promise.all([
		chatProjectId ? projectModel.getProjectById(ctx, chatProjectId) : Promise.resolve(null),
		chatProjectId ? designModel.getProjectDesigns(ctx, chatProjectId) : Promise.resolve([]),
		chatDesignId ? designModel.getDesignById(ctx, chatDesignId) : Promise.resolve(null)
	]);

	if (chatProject) {
		contextParts.push(`**Current Project ID:** ${chatProject._id}\n`);
		contextParts.push(`**Current Project Name:** ${chatProject.name}\n`);
		contextParts.push(`**Current Project Description:** ${chatProject.description}\n`);
		contextParts.push(`**Current Project Summary:** ${chatProject.summary}\n`);
		contextParts.push(
			`**Project Has Existing Floor Plans:** ${(chatProject.floorPlanFiles ?? []).length > 0}\n\n`
		);
	}

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

	if (chatProjectDesigns.length > 0)
		contextParts.push(
			`**Current Project Designed Spaces:** ${chatProjectDesigns.map((design) => design.spaceType).join(', ')}\n\n`
		);

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
