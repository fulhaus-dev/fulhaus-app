import { ToolSet } from 'ai';
import { AiToolCtxParams, ToolFnSet } from '../../type';

export function getAiAgentTools(toolCtxParams: AiToolCtxParams, toolFnSet?: ToolFnSet) {
	if (!toolFnSet) return {};

	const tools = Object.keys(toolFnSet).reduce((toolSet, toolName) => {
		const currentTool = toolFnSet[toolName](toolCtxParams);
		toolSet[toolName] = currentTool;

		return toolSet;
	}, {} as ToolSet);

	return tools;
}
