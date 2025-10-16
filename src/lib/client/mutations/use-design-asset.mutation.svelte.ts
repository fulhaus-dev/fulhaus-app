import type { DesignAssetFileType } from '$lib/types';
import asyncFetch from '$lib/utils/async-fetch';
import compressor from '$lib/utils/compression';
import { asyncTryCatch } from '$lib/utils/try-catch';

export function useDesignAssetMutation(args?: { onUpload?: (url: string) => void }) {
	const state = $state({
		uploading: false,
		error: undefined as string | undefined
	});

	async function uploadDesignAssetFile(file: File, type: DesignAssetFileType) {
		state.uploading = true;

		const { data: compressedFile } = await asyncTryCatch(() =>
			compressor.compressImageFile({ imageFile: file })
		);

		if (!compressedFile) {
			state.error = 'Could not compress image, try again.';
			state.uploading = false;
			return;
		}

		const formData = new FormData();
		formData.append('file', file, file.name);
		formData.append('type', type);

		const { response, error: uploadError } = await asyncFetch.post(
			'/api/design-asset/upload/file',
			{
				body: formData,
				ignoreContentType: true
			}
		);
		if (uploadError) {
			state.error = uploadError.message;
			state.uploading = false;
			return;
		}

		const data = await response.json();

		args?.onUpload?.(data.url);

		state.uploading = false;
	}

	async function uploadDesignAssetUrl(url: string, type: DesignAssetFileType) {
		state.uploading = true;

		const { response, error: uploadError } = await asyncFetch.post('/api/design-asset/upload/url', {
			body: JSON.stringify({ url, type })
		});

		if (uploadError) {
			state.error = uploadError.message;
			state.uploading = false;
			return;
		}

		const data = await response.json();

		args?.onUpload?.(data.url);

		state.uploading = false;
	}

	return {
		designAssetMutationState: state,
		uploadDesignAssetFile,
		uploadDesignAssetUrl
	};
}
