import { stepCountIs } from 'ai';
import { googleGemini2_5FlashChat } from '../../../config/google';
import {
	createDesignTool,
	redirectToStartNewDesignInSameProjectTool,
	updateDesignTool
} from './tool/design';
import { getProductCategoriesForDesignTool } from './tool/product';
import { createProjectTool, updateProjectTool } from './tool/project';
import { generateDesignFurnitureRecommendationTool } from './tool/recommendation';
import uiTools from './tool/ui';
import { AgentConfig } from '../../../type';
import { Id } from '../../../_generated/dataModel';

export const ludwigAgent: AgentConfig = {
	options: {
		model: googleGemini2_5FlashChat,
		systemPromptFileId: process.env.LUDWIG_SYSTEM_PROMPT_FILE_ID! as Id<'_storage'>,
		stopWhen: stepCountIs(200)
	},
	toolFnSet: {
		createProject: createProjectTool,
		updateProject: updateProjectTool,
		...uiTools,
		getProductCategoriesForDesign: getProductCategoriesForDesignTool,
		createDesign: createDesignTool,
		updateDesign: updateDesignTool,
		generateDesignFurnitureRecommendation: generateDesignFurnitureRecommendationTool,
		redirectToStartNewDesignInSameProject: redirectToStartNewDesignInSameProjectTool
	}
};
