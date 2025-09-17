import { tool } from 'ai';
import { AiToolCtxParams } from '../../../../type';
import z from 'zod';

function provideInspirationImageUiTool(toolCtxParams: AiToolCtxParams) {
	return tool({
		description: 'Displays a UI to provide an inspiration image.',
		inputSchema: z.object({}),
		execute: async () => {
			return {
				success: true,
				chatId: toolCtxParams.chatId,
				uiType: 'Provide Inspiration Image',
				toolName: 'provideInspirationImageUI',
				message: 'Provide inspiration image UI displayed successfully'
			};
		}
	});
}

function provideFloorPlanUiTool(toolCtxParams: AiToolCtxParams) {
	return tool({
		description: 'Displays a UI to provide a floor plan.',
		inputSchema: z.object({}),
		execute: async () => {
			return {
				success: true,
				message: 'Floor plan UI displayed successfully',
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
