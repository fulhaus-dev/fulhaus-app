import type { Doc } from '../../convex/_generated/dataModel';

function getChatMessageContent(messageContent: Doc<'chatMessages'>['message']['content']) {
	if (typeof messageContent === 'string')
		return [
			{
				type: 'text',
				text: messageContent
			}
		];

	return messageContent;
}

const chat = {
	getChatMessageContent
};
export default chat;
