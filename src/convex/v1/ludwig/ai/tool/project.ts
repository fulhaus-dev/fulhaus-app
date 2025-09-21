import { tool } from 'ai';
import z from 'zod';
import { internal } from '../../../../_generated/api';
import { Id } from '../../../../_generated/dataModel';
import { AiToolCtxParams } from '../../../../type';

export function createProjectTool(toolCtxParams: AiToolCtxParams) {
	return tool({
		description: 'Create project',
		inputSchema: z
			.object({
				name: z
					.string()
					.describe('A descriptive name for the project based on the project scope and layout.'),
				description: z.string().describe('A short, one-sentence description of the project.'),
				summary: z
					.string()
					.describe(
						'A detailed summary of the project spaces based ont the user query and if a floor plan was provided include all the rooms and spaces that can be designed in the future. This summary is to help other LLMs understand the project and know what spaces to suggest to the user next, without the user having to provide same information, already provided in another chat session.'
					)
			})
			.strip(),
		execute: async (input) => {
			const { ctx, userId, workspaceId, chatId } = toolCtxParams;

			const newProjectId = await ctx.runMutation(
				internal.v1.project.internal.mutation.createProject,
				{
					userId,
					create: {
						...input,
						workspaceId
					}
				}
			);

			await ctx.runMutation(internal.v1.chat.internal.mutation.updateChatById, {
				chatId,
				projectId: newProjectId
			});

			return {
				success: true,
				message: 'Project created successfully',
				projectId: newProjectId
			};
		}
	});
}

export function updateProjectTool(toolCtxParams: AiToolCtxParams) {
	return tool({
		description: 'Update project',
		inputSchema: z
			.object({
				projectId: z.string().describe('The ID of the project to update.'),
				update: z
					.object({
						name: z.string().optional().describe('The new name for the project.'),
						description: z
							.string()
							.describe('The new short, one sentence description for the project.'),
						summary: z
							.string()
							.optional()
							.describe(
								'new updated detailed summary of the project spaces based ont the user query and if a floor plan was provided include all the rooms and spaces that can be designed in the future. This summary is to help other LLMs understand the project and know what spaces to suggest to the user next, without the user having to provide same information, already provided in another chat session.'
							)
					})
					.strip()
			})
			.strip(),
		execute: async (input) => {
			const { ctx, userId } = toolCtxParams;
			const { projectId, update } = input;

			await ctx.runMutation(internal.v1.project.internal.mutation.updateProjectById, {
				userId,
				projectId: projectId as Id<'projects'>,
				update
			});

			return {
				success: true,
				message: 'Project updated successfully',
				projectId
			};
		}
	});
}
