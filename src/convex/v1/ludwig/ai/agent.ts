import { googleGemini2_5FlashChat } from '../../../config/google';
import { systemInstruction } from './system';
import { createDesignTool, updateDesignTool } from './tools/design';
import { getProductCategoriesForDesignTool } from './tools/product';
import { createProjectTool, updateProjectTool } from './tools/project';
import { generateDesignFurnitureRecommendationTool } from './tools/recommendation';
import { provideFloorPlanUiTool, provideInspirationImageUiTool } from './tools/ui';

export const ludwigAgentOptions = {
	model: googleGemini2_5FlashChat,
	system: systemInstruction
};

export const ludwigAgentToolFnSet = {
	createProject: createProjectTool,
	updateProject: updateProjectTool,
	provideInspirationImageUI: provideInspirationImageUiTool,
	provideFloorPlanUI: provideFloorPlanUiTool,
	getProductCategoriesForDesign: getProductCategoriesForDesignTool,
	createDesign: createDesignTool,
	updateDesign: updateDesignTool,
	generateDesignFurnitureRecommendation: generateDesignFurnitureRecommendationTool
};
