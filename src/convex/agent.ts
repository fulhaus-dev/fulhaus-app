import { AgentConfig } from './type';
import { ludwigAgent } from './v1/ludwig/ai/agent';

export const agentConfig = {
	Ludwig: ludwigAgent
} as Record<string, AgentConfig>;
