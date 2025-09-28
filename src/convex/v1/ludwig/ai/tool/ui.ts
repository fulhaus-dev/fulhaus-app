import { tool } from 'ai';
import { AiToolCtxParams } from '../../../../type';
import z from 'zod';

function provideInspirationImageUiTool(toolCtxParams: AiToolCtxParams) {
	return tool({
		description: 'Displays a UI to the user to provide an inspiration image.',
		inputSchema: z.object({}),
		execute: async () => {
			return {
				success: true,
				chatId: toolCtxParams.chatId,
				uiType: 'Provide Inspiration Image',
				toolName: 'provideInspirationImageUI',
				message:
					'The UI for the user to provide the inspiration image has been displayed. End your turn after you have informed the user to provide the inspiration image (if you have not already, do not repeat information) and wait for the user to provide the inspiration image before you proceed.'
			};
		}
	});
}

function provideFloorPlanUiTool(toolCtxParams: AiToolCtxParams) {
	return tool({
		description: 'Displays a UI to the user to provide a floor plan.',
		inputSchema: z.object({}),
		execute: async () => {
			return {
				success: true,
				message:
					'The UI for the user to provide the floor plan has been displayed. End your turn after you have informed the user to provide the floor plan (if you have not already, do not repeat information) and wait for the user to provide the floor plan, before you proceed.',
				chatId: toolCtxParams.chatId,
				uiType: 'Provide Floor Plan',
				toolName: 'provideFloorPlanUI'
			};
		}
	});
}

const ludwigUiTools = {
	provideInspirationImageUI: provideInspirationImageUiTool,
	provideFloorPlanUI: provideFloorPlanUiTool
};
export default ludwigUiTools;
