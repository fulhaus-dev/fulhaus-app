import { v } from 'convex/values';
import { internalAction } from '../../../_generated/server';
import { smoothStream, streamText } from 'ai';
import { googleGemini2_5FlashChat } from '../../../config/google';
import { internal } from '../../../_generated/api';
import { vChatMessage } from '../validator';

export const streamChatResponse = internalAction({
	args: {
		workspaceId: v.id('workspaces'),
		userId: v.id('users'),
		chatId: v.id('chats'),
		messages: v.array(vChatMessage)
	},
	handler: async (ctx, { workspaceId, userId, chatId, messages }) => {
		const result = streamText({
			model: googleGemini2_5FlashChat,
			system: 'You are a helpful assistant.',
			messages,
			experimental_transform: smoothStream({
				delayInMs: 20
			}),
			onFinish: async (f) => {
				await ctx.scheduler.runAfter(
					1000,
					internal.v1.chat.internal.mutation.deleteChatResponseStreams,
					{
						workspaceId,
						chatId
					}
				);

				for (const responseMessage of f.response.messages) {
					await ctx.runMutation(internal.v1.chat.internal.mutation.saveChatAssistantResponse, {
						workspaceId,
						userId,
						chatId,
						message: responseMessage,
						usage: f.usage
					});
				}
			}
		});

		const messageChunks = result.toUIMessageStream();

		for await (const chunk of messageChunks) {
			await ctx.runMutation(internal.v1.chat.internal.mutation.saveChatResponseStream, {
				workspaceId,
				chatId,
				stream: chunk
			});
		}
	}
});
