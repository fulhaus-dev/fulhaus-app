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
					'The UI for the user to provide the inspiration image has been displayed.. End your turn after you have informed the user to provide the inspiration image and wait for the user to provide the inspiration image before you proceed.'
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
					'The UI for the user to provide the floor plan has been displayed. End your turn after you have informed the user to provide the floor plan and wait for the user to provide the floor plan, before you proceed.',
				chatId: toolCtxParams.chatId,
				uiType: 'Provide Floor Plan',
				toolName: 'provideFloorPlanUI'
			};
		}
	});
}

function selectFromExistingFloorPlansUiTool(toolCtxParams: AiToolCtxParams) {
	return tool({
		description: 'Displays a UI to the user to select from existing floor plans.',
		inputSchema: z.object({}),
		execute: async () => {
			return {
				success: true,
				message:
					'The UI for the user the select existing floor plans has been displayed. End your turn after you have informed the user to select from existing floor plans and wait for the user to select from existing floor plans, before you proceed.',
				chatId: toolCtxParams.chatId,
				uiType: 'Select from existing Floor Plans',
				toolName: 'selectFromExistingFloorPlansUI'
			};
		}
	});
}

const ludwigUiTools = {
	provideInspirationImageUI: provideInspirationImageUiTool,
	provideFloorPlanUI: provideFloorPlanUiTool,
	selectFromExistingFloorPlansUI: selectFromExistingFloorPlansUiTool
};
export default ludwigUiTools;
