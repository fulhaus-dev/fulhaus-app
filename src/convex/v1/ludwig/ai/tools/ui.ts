import { tool } from 'ai';
import { AiToolCtxParams } from '../../../../type';
import z from 'zod';

export function provideInspirationImageUiTool(toolCtxParams: AiToolCtxParams) {
	return tool({
		description: 'Displays a UI to provide an inspiration image.',
		inputSchema: z.object({}),
		execute: async () => {
			return {
				chatId: toolCtxParams.chatId,
				uiType: 'Provide Inspiration Image',
				message: 'Provide inspiration image UI displayed successfully'
			};
		}
	});
}

export function provideFloorPlanUiTool(toolCtxParams: AiToolCtxParams) {
	return tool({
		description: 'Displays a UI to provide a floor plan.',
		inputSchema: z.object({}),
		execute: async () => {
			return {
				chatId: toolCtxParams.chatId,
				uiType: 'Provide Floor Plan',
				message: 'Provide floor plan UI displayed successfully'
			};
		}
	});
}
