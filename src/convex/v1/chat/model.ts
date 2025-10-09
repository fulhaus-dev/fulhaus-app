import { Infer } from 'convex/values';
import { Id } from '../../_generated/dataModel';
import { MutationCtx, QueryCtx } from '../../_generated/server';
import array from '../../util/array';
import userModel from '../user/model';
import { vChatUiMessage, vChatUsage } from './validator';
import { UIMessage } from 'ai';

async function createChat(
	ctx: MutationCtx,
	args: { workspaceId: Id<'workspaces'>; userId: Id<'users'> }
) {
	const { workspaceId, userId } = args;

	return await ctx.db.insert('chats', {
		workspaceId,
		createdById: userId
	});
}

async function getChatById(ctx: QueryCtx, chatId: Id<'chats'>) {
	return await ctx.db.get(chatId);
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

async function saveChatUiMessage(
	ctx: MutationCtx,
	args: {
		workspaceId: Id<'workspaces'>;
		userId: Id<'users'>;
		chatId: Id<'chats'>;
		message: Infer<typeof vChatUiMessage>;
	}
) {
	const { userId, ...otherArgs } = args;

	return await ctx.db.insert('chatUiMessages', {
		...otherArgs,
		createdById: userId
	});
}

async function getChatUiMessages(
	ctx: QueryCtx,
	args: {
		workspaceId: Id<'workspaces'>;
		chatId: Id<'chats'>;
	}
) {
	return await ctx.db
		.query('chatUiMessages')
		.withIndex('workspace_chat_message', (q) =>
			q.eq('workspaceId', args.workspaceId).eq('chatId', args.chatId)
		)
		.collect();
}

async function getChatUiMessagesAndUsers(
	ctx: QueryCtx,
	args: {
		workspaceId: Id<'workspaces'>;
		chatId: Id<'chats'>;
	}
) {
	const chatUiMessages = await getChatUiMessages(ctx, args);

	const chatUsers = await Promise.all(
		array
			.getUniqueListBy(chatUiMessages, 'createdById')
			.map((chatUiMessage) => userModel.getUserById(ctx, chatUiMessage.createdById))
	);

	const chatUsersMetadata = chatUsers
		.filter((user) => !!user)
		.map((user) => ({
			userId: user._id as string,
			fullName: user.fullName!,
			imageUrl: user.imageUrl
		}));

	return {
		messages: chatUiMessages.map((uiMessage) => ({
			...uiMessage.message,
			metadata: {
				...uiMessage.message.metadata,
				userId: uiMessage.createdById
			}
		})) as UIMessage[],
		users: chatUsersMetadata
	};
}

async function saveChatUsage(
	ctx: MutationCtx,
	args: {
		workspaceId: Id<'workspaces'>;
		chatId: Id<'chats'>;
		usage: Infer<typeof vChatUsage>;
	}
) {
	return await ctx.db.insert('chatUsageTokens', args);
}

const chatModel = {
	createChat,
	getChatById,
	updateChatById,
	saveChatUiMessage,
	getChatUiMessages,
	getChatUiMessagesAndUsers,
	saveChatUsage
};
export default chatModel;
