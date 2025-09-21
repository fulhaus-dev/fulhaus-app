import { goto } from '$app/navigation';
import asyncFetch from '$lib/utils/async-fetch';

export function useFileDownload() {
	const state = $state({
		downloading: false
	});

	async function downloadFileInBrowser(args: { fileUrl: string; fileName: string }) {
		state.downloading = true;

		const { response, error: fileDownloadError } = await asyncFetch.get(
			`/api/file-url/download?url=${encodeURIComponent(args.fileUrl)}&name=${encodeURIComponent(`${args.fileName}`)}`
		);

		if (fileDownloadError) {
			// eslint-disable-next-line svelte/no-navigation-without-resolve
			goto('/404');

			setTimeout(() => {
				state.downloading = false;
			}, 500);

			return;
		}

		const blob = await response.blob();

		let downloadedFileName = args.fileName;

		const contentDisposition = response.headers.get('content-disposition');

		if (contentDisposition) {
			const matches = /filename="([^"]+)"/.exec(contentDisposition);

			downloadedFileName = matches ? matches[1] : downloadedFileName;
		}

		const blobUrl = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = blobUrl;
		link.download = downloadedFileName;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		URL.revokeObjectURL(blobUrl);
	}

	return {
		downloadFileInBrowser
	};
}
