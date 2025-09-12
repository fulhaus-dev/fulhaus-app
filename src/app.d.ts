// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

import type { Id } from './convex/_generated/dataModel';
import type { ImageData } from '$lib/types';

declare global {
	namespace App {
		interface Locals {
			currentUserId?: Id<'users'>;
			activeWorkspaceId?: Id<'workspaces'>;
		}

		interface PageData {
			currentUserId?: Id<'users'>;
			activeWorkspaceId?: Id<'workspaces'>;
			sampleInspoImages: ImageData[];
		}
	}
}

export {};
