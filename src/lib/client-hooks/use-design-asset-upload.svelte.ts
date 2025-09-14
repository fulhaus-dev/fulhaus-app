import type { DesignAssetFileType } from '$lib/types';
import asyncFetch from '$lib/utils/async-fetch';

export function useDesignAssetUpload(args?: { onUpload?: (url: string) => void }) {
	const state = $state({
		uploading: false,
		error: undefined as string | undefined
	});

	async function uploadFile(file: File, type: DesignAssetFileType) {
		state.uploading = true;

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

	async function uploadUrl(url: string, type: DesignAssetFileType) {
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
		designAssetUpload: state,
		uploadFile,
		uploadUrl
	};
}
