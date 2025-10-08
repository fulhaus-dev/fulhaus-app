import { getRandomUnsplashPhotos } from '$lib/server/unsplash';

export async function load({ locals }) {
	const { data: sampleInspoImages = [] } = await getRandomUnsplashPhotos();

	return {
		activeWorkspaceId: locals.activeWorkspaceId,
		currentUserId: locals.currentUserId,
		authToken: locals.authToken,
		sampleInspoImages
	};
}
