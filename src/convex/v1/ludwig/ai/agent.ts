import { stepCountIs } from 'ai';
import { googleGemini2_5FlashChat } from '../../../config/google';
import { createDesignTool, updateDesignTool } from './tools/design';
import { getProductCategoriesForDesignTool } from './tools/product';
import { createProjectTool, updateProjectTool } from './tools/project';
import { generateDesignFurnitureRecommendationTool } from './tools/recommendation';
import uiTools from './tools/ui';
import { AgentConfig } from '../../../type';
import { Id } from '../../../_generated/dataModel';

export const ludwigAgent: AgentConfig = {
	options: {
		model: googleGemini2_5FlashChat,
		systemPromptFileId: process.env.LUDWIG_SYSTEM_PROMPT_FILE_ID! as Id<'_storage'>,
		stopWhen: stepCountIs(5)
	},
	toolFnSet: {
		createProject: createProjectTool,
		updateProject: updateProjectTool,
		...uiTools,
		getProductCategoriesForDesign: getProductCategoriesForDesignTool,
		createDesign: createDesignTool,
		updateDesign: updateDesignTool,
		generateDesignFurnitureRecommendation: generateDesignFurnitureRecommendationTool
	}
};
