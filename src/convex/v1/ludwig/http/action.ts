import { httpAction } from '../../../_generated/server';
import {
	convertToModelMessages,
	generateId,
	smoothStream,
	stepCountIs,
	streamText,
	UIMessage
} from 'ai';
import { Id } from '../../../_generated/dataModel';
import httpAuthorization from '../../../middleware/http/authorization';
import ServerError from '../../../response/error';
import { agentConfig } from '../../../agent';
import { getAiAgentTools } from '../../chat/util';
import { FloorPlanFile } from '../../../type';
import { internal } from '../../../_generated/api';
import { Infer } from 'convex/values';
import { vChatUiMessage } from '../../chat/validator';

type LudwigChatMetadata = {
	chatId: Id<'chats'>;
	inspoImageUrl?: string;
	floorPlanFile?: FloorPlanFile;
};

export const streamLudwigChatResponse = httpAction(async (ctx, request) => {
	const workspaceId = request.headers.get('X-Workspace-Id') as Id<'workspaces'>;
	if (!workspaceId || workspaceId === '') throw ServerError.BadRequest('Workspace ID not found.');

	const userId = await httpAuthorization.workspaceMemberIsAuthorizedToPerformFunction(
		ctx,
		workspaceId,
		'createDesign'
	);

	const { message }: { message: UIMessage } = await request.json();

	const { chatId, inspoImageUrl, floorPlanFile } = (message?.metadata ?? {}) as LudwigChatMetadata;
	if (!chatId || chatId === '') throw ServerError.BadRequest('Chat ID not found');

	if (inspoImageUrl)
		await ctx.runMutation(internal.v1.ludwig.internal.mutation.setLudwigChatTempAssetByChatId, {
			chatId,
			assets: { inspoImageUrl }
		});

	if (floorPlanFile)
		await ctx.runMutation(internal.v1.ludwig.internal.mutation.setLudwigChatTempAssetByChatId, {
			chatId,
			assets: { floorPlanFile }
		});

	await httpAuthorization.isWorkspaceChat(ctx, workspaceId, chatId);

	const { options: agentOptions, toolFnSet: agentToolFnSet } = agentConfig['Ludwig'];

	const agentTools = getAiAgentTools({ ctx, workspaceId, chatId, userId }, agentToolFnSet);

	const { systemPromptFileId, maxToolCallSteps, ...otherAgentOptions } = agentOptions;

	const promptBlob = await ctx.storage.get(systemPromptFileId);
	const systemPrompt = await promptBlob?.text();

	const [previousChatUiMessages, ludwigChatDesignContext] = await Promise.all([
		ctx.runQuery(internal.v1.chat.internal.query.getChatUiMessages, { workspaceId, chatId }),
		ctx.runQuery(internal.v1.ludwig.internal.query.getLudwigDesignChatContext, {
			chatId,
			floorPlanUrl: floorPlanFile?.url
		})
	]);

	const previousUiMessages = previousChatUiMessages.map((chatUiMessage) => ({
		...chatUiMessage.message
	}));
	const allUiMessages = [...previousUiMessages, message] as UIMessage[];

	const modelMessages = convertToModelMessages(allUiMessages);

	if (ludwigChatDesignContext)
		modelMessages.unshift({
			role: 'system',
			content: ludwigChatDesignContext
		});

	// modelMessages.unshift({
	// 	role: 'system',
	// 	content: `Your responses MUST be short and concise, no verbose responses or lengthy explanations. Go straight to the question or response, keep you answers short and to the point. Do not explain or list things. After recommendation do not list the recommended items or types, just inform the user with the appropriate response that their recommendation has been generated.\n\n`
	// });

	const result = streamText({
		...otherAgentOptions,
		temperature: 0.1,
		system: systemPrompt,
		messages: modelMessages,
		tools: agentTools,
		stopWhen: stepCountIs(maxToolCallSteps),
		experimental_transform: smoothStream({
			delayInMs: 20
		})
	});

	const stream = result.toUIMessageStreamResponse({
		originalMessages: allUiMessages,
		generateMessageId: generateId,
		messageMetadata: async ({ part }) => {
			if (part.type === 'finish')
				await ctx.runMutation(internal.v1.chat.internal.mutation.saveChatUsage, {
					workspaceId,
					chatId,
					usage: part.totalUsage
				});
		},
		onFinish: async ({ messages }) => {
			const previousUiMessagesCount = previousUiMessages.length;

			const newUiMessages = messages.slice(previousUiMessagesCount) as Infer<
				typeof vChatUiMessage
			>[];

			for (const newUiMessage of newUiMessages) {
				await ctx.runMutation(internal.v1.chat.internal.mutation.saveChatUiMessage, {
					workspaceId,
					userId,
					chatId,
					message: newUiMessage
				});
			}
		}
	});

	stream.headers.set('Access-Control-Allow-Origin', 'http://localhost:5173');

	return stream;
});
