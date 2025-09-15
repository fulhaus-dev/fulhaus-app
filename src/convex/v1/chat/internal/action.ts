import { v } from 'convex/values';
import { internalAction } from '../../../_generated/server';
import { smoothStream, streamText } from 'ai';
import { internal } from '../../../_generated/api';
import { vChatMessage } from '../validator';
import { vAiAgentOptions, vAiAgentToolFnSet } from '../../../validator';
import { getAiAgentTools } from '../util';

export const streamChatResponse = internalAction({
	args: {
		workspaceId: v.id('workspaces'),
		userId: v.id('users'),
		chatId: v.id('chats'),
		agentOptions: vAiAgentOptions,
		agentToolFnSet: v.optional(vAiAgentToolFnSet),
		messages: v.array(vChatMessage)
	},

	handler: async (ctx, { workspaceId, userId, chatId, agentOptions, agentToolFnSet, messages }) => {
		const agentTools = getAiAgentTools({ ctx, workspaceId, chatId, userId }, agentToolFnSet);

		const result = streamText({
			...agentOptions,
			messages,
			tools: agentTools,
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
