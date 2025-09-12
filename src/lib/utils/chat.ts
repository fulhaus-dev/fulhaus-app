import type { Doc } from '../../convex/_generated/dataModel';

function getChatMessageContentTexts(messageContent: Doc<'chatMessages'>['message']['content']) {
	if (typeof messageContent === 'string') return messageContent;

	return messageContent
		.filter((content) => content.type === 'text')
		.map((content) => content.text)
		.join('');
}

const chat = {
	getChatMessageContentTexts
};
export default chat;
