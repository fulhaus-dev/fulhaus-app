import { createApi } from 'unsplash-js';

import { UNSPLASH_ACCESS_KEY } from '$env/static/private';
import { asyncTryCatch } from '$lib/utils/try-catch';

import type { Random } from 'unsplash-js/dist/methods/photos/types';
import type { ImageData } from '$lib/types';

const unsplash = createApi({
	accessKey: UNSPLASH_ACCESS_KEY
});

let randomPhotos: ImageData[] = [];

export async function getRandomUnsplashPhotos() {
	if (randomPhotos.length > 0) {
		return {
			data: randomPhotos
		};
	}

	const { data: response, error } = await asyncTryCatch(() =>
		unsplash.photos.getRandom({
			count: 42,
			query: 'interior design'
		})
	);
	if (error) return { error };

	if (response.type !== 'success')
		return { error: { statusCode: response.status, message: response.errors.join(', ') } };

	randomPhotos = (response.response as Random[]).map((photo) => ({
		id: photo.id,
		description: photo.description ?? undefined,
		url: photo.urls.regular
	}));

	return {
		data: randomPhotos
	};
}
