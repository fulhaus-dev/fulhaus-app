import { v } from 'convex/values';
import { ActionCtx, internalAction } from '../../../_generated/server';
import { LanguageModelUsage, smoothStream, StepResult, streamText, ToolSet } from 'ai';
import { internal } from '../../../_generated/api';
import { vChatMessage } from '../validator';
import { getAiAgentTools } from '../util';
import { agentConfig } from '../../../agent';
import { Id } from '../../../_generated/dataModel';

export const streamChatResponse = internalAction({
	args: {
		workspaceId: v.id('workspaces'),
		userId: v.id('users'),
		chatId: v.id('chats'),
		agentName: v.string(),
		additionalSystemContext: v.optional(v.string()),
		messages: v.array(vChatMessage)
	},

	handler: async (
		ctx,
		{ workspaceId, userId, chatId, agentName, additionalSystemContext, messages }
	) => {
		const { options: agentOptions, toolFnSet: agentToolFnSet } = agentConfig[agentName];

		const agentTools = getAiAgentTools({ ctx, workspaceId, chatId, userId }, agentToolFnSet);

		const { systemPromptFileId, ...otherAgentOptions } = agentOptions;

		const promptBlob = await ctx.storage.get(systemPromptFileId);
		const systemPrompt = await promptBlob?.text();

		if (additionalSystemContext)
			messages.unshift({
				role: 'system',
				content: additionalSystemContext
			});

		const result = streamText({
			...otherAgentOptions,
			system: systemPrompt,
			messages,
			tools: agentTools,
			experimental_transform: smoothStream({
				delayInMs: 20
			}),
			onFinish: (finish) => onFinish(ctx, finish, { userId, workspaceId, chatId }),
			onError: (err) => console.error('Error', err)
		});

		const messageChunks = result.toUIMessageStream();

		for await (const chunk of messageChunks) {
			console.log('chunk', chunk);
			await ctx.runMutation(internal.v1.chat.internal.mutation.saveChatResponseStream, {
				workspaceId,
				chatId,
				stream: chunk
			});
		}
	}
});

async function onFinish(
	ctx: ActionCtx,
	finish: StepResult<ToolSet> & {
		readonly steps: StepResult<ToolSet>[];
		readonly totalUsage: LanguageModelUsage;
	},
	args: { userId: Id<'users'>; workspaceId: Id<'workspaces'>; chatId: Id<'chats'> }
) {
	const { userId, workspaceId, chatId } = args;

	await ctx.scheduler.runAfter(1000, internal.v1.chat.internal.mutation.deleteChatResponseStreams, {
		workspaceId,
		chatId
	});

	for (const responseMessage of finish.response.messages) {
		await ctx.runMutation(internal.v1.chat.internal.mutation.saveChatAssistantResponse, {
			workspaceId,
			userId,
			chatId,
			message: responseMessage,
			usage: finish.usage
		});
	}
}
