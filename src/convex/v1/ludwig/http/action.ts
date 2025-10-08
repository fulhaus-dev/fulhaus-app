import { httpAction } from '../../../_generated/server';
import { convertToModelMessages, smoothStream, stepCountIs, streamText, UIMessage } from 'ai';
import { Id } from '../../../_generated/dataModel';
import httpAuthorization from '../../../middleware/http/authorization';
import ServerError from '../../../response/error';
import { agentConfig } from '../../../agent';
import { getAiAgentTools } from '../../chat/util';
import { FloorPlanFile } from '../../../type';
import { internal } from '../../../_generated/api';
import { xaiGrok4Fast } from '../../../config/x';

type LudwigChatMetadata = {
	chatId: Id<'chats'>;
	inspoImageUrl?: string;
	floorPlanFile?: FloorPlanFile;
};

export const streamLudwigChatResponse = httpAction(async (ctx, request) => {
	const workspaceId = request.headers.get('X-Workspace-Id') as Id<'workspaces'>;
	if (!workspaceId || workspaceId === '') throw ServerError.BadRequest('Workspace ID not found.');

	const { messages }: { messages: UIMessage[] } = await request.json();
	const lastMessage = messages[messages.length - 1];

	const { chatId, inspoImageUrl, floorPlanFile } = (lastMessage?.metadata ??
		{}) as LudwigChatMetadata;
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

	const userId = await httpAuthorization.workspaceMemberIsAuthorizedToPerformFunction(
		ctx,
		workspaceId,
		'createDesign'
	);

	await httpAuthorization.isWorkspaceChat(ctx, workspaceId, chatId);

	const { options: agentOptions, toolFnSet: agentToolFnSet } = agentConfig['Ludwig'];

	const agentTools = getAiAgentTools({ ctx, workspaceId, chatId, userId }, agentToolFnSet);

	const { systemPromptFileId, maxToolCallSteps, ...otherAgentOptions } = agentOptions;

	const promptBlob = await ctx.storage.get(systemPromptFileId);
	const systemPrompt = await promptBlob?.text();

	const ludwigChatDesignContext = await ctx.runQuery(
		internal.v1.ludwig.internal.query.getLudwigDesignChatContext,
		{ chatId, floorPlanUrl: floorPlanFile?.url }
	);

	const modelMessages = convertToModelMessages(messages);

	if (ludwigChatDesignContext)
		modelMessages.unshift({
			role: 'system',
			content: ludwigChatDesignContext
		});

	modelMessages.unshift({
		role: 'system',
		content: `Your responses MUST be short and concise, no verbose responses or lengthy explanations. Go straight to the question or response, keep you answers short and to the point. Do not explain or list things. After recommendation do not list the recommended items or types, just inform the user with the appropriate response that their recommendation has been generated.\n\n`
	});

	const result = streamText({
		...otherAgentOptions,
		model: xaiGrok4Fast,
		providerOptions: undefined,
		temperature: 0.1,
		system: systemPrompt,
		messages: modelMessages,
		tools: agentTools,
		stopWhen: stepCountIs(maxToolCallSteps),
		experimental_transform: smoothStream({
			delayInMs: 20
		}),
		onFinish: async (finish) => console.log(Object.keys(finish)),
		onError: async (error) => console.log(error)
	});

	const stream = result.toUIMessageStreamResponse();
	stream.headers.set('Access-Control-Allow-Origin', process.env.APP_URL!);

	return stream;
});
