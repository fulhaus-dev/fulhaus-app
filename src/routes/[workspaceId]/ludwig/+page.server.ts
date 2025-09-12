import { getRandomUnsplashPhotos } from '$lib/server/unsplash';

export async function load() {
	const { data: sampleInspoImages = [] } = await getRandomUnsplashPhotos();
	return {
		sampleInspoImages
	};
}
