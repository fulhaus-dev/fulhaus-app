import { googleGenerativeAIGemini2_5Flash } from '../../../config/google';
import {
	createDesignTool,
	redirectToStartNewDesignChatTool,
	updateDesignTool
} from './tool/design';
import { getProductCategoriesForDesignTool } from './tool/product';
import { generateDesignFurnitureRecommendationTool } from './tool/recommendation';
import uiTools from './tool/ui';
import { AgentConfig } from '../../../type';
import { Id } from '../../../_generated/dataModel';

export const ludwigAgent: AgentConfig = {
	options: {
		model: googleGenerativeAIGemini2_5Flash,
		systemPromptFileId: process.env.LUDWIG_SYSTEM_PROMPT_FILE_ID! as Id<'_storage'>,
		maxToolCallSteps: 200,
		providerOptions: {
			google: {
				thinkingConfig: {
					thinkingBudget: 0,
					includeThoughts: false
				}
			}
		}
	},
	toolFnSet: {
		...uiTools,
		getProductCategoriesForDesign: getProductCategoriesForDesignTool,
		createDesign: createDesignTool,
		updateDesign: updateDesignTool,
		generateDesignFurnitureRecommendation: generateDesignFurnitureRecommendationTool,
		redirectToStartNewDesignChat: redirectToStartNewDesignChatTool
	}
};
